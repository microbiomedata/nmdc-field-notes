import {
  AnonymousSlotExpression,
  ClassDefinition,
  ClassExpression,
  SchemaDefinition,
  SlotDefinition,
} from "./linkml-metamodel";
import { parse } from "date-fns";

interface GetValidatorsForSlotOptions {
  cacheKey?: string;
  inheritedRange?: string;
}

interface ValidatorOptions {
  dateFormat?: string;
  dateTimeFormat?: string;
}

export type ValidatorFn = (value: unknown) => string | undefined;
export type ValidationResults = Record<number, Record<string, string>>;

// Get the date representing the Unix epoch (January 1, 1970). We'll use it as a
// source of specific date elements when parsing ambiguous dates. Specifically,
// this will cause midnight to be used as the time when parsing a string that only
// contains a date.
// Reference: https://date-fns.org/v3.6.0/docs/parse#arguments
const REF_DATE = new Date(0);

function validateUniqueValues(values: unknown[][]): boolean[] {
  const results: boolean[] = [];

  // In the event that the column arrays are of unequal length, make sure
  // that we iterate through the longest one.
  const longestColumn = Math.max.apply(
    null,
    values.map((col) => col.length),
  );

  const previousValues = new Map();
  for (let row = 0; row < longestColumn; row += 1) {
    const rowValue = values.map((col) => String(col[row]));
    // This should be a safe way to produce a unique hash for the row. If there
    // are edge cases where this doesn't work we could look at more robust
    // solutions (e.g. https://github.com/puleos/object-hash).
    const rowHash = rowValue.join("\u0000");

    // If we have seen this hash value before it will be in the previousValues
    // map. The key will be the row where we last saw it. This means we have a
    // duplicate and both this row and the previous row need to be marked as
    // in valid.
    let rowValid = true;
    if (previousValues.has(rowHash)) {
      const previousRow = previousValues.get(rowHash);
      results[previousRow] = false;
      rowValid = false;
    }

    // Save this row's hash for comparison with future rows
    previousValues.set(rowHash, row);
    results[row] = rowValid;
  }
  return results;
}

class Validator {
  private schema: SchemaDefinition;
  private targetClass: ClassDefinition | undefined;
  private targetClassInducedSlots: Record<string, SlotDefinition> | undefined;
  private valueValidatorMap: Map<string, ValidatorFn>;
  private readonly dateFormat;
  private readonly dateTimeFormat;
  private identifiers: string[];
  private results: ValidationResults;

  constructor(schema: SchemaDefinition, options: ValidatorOptions = {}) {
    this.schema = schema;
    this.valueValidatorMap = new Map();
    this.dateFormat = options.dateFormat || "yyyy-MM-dd";
    this.dateTimeFormat = options.dateTimeFormat || "yyyy-MM-dd HH:mm";
    this.identifiers = [];
    this.results = {};
  }

  useTargetClass(className: string) {
    const classDefinition = this.schema.classes?.[className];
    if (classDefinition === undefined) {
      throw new Error(`No class named '${className}'`);
    }

    this.results = {};
    this.targetClass = classDefinition;
    this.targetClassInducedSlots = classDefinition.attributes;

    this.identifiers = Object.values(this.targetClassInducedSlots!)
      .filter((slot) => slot.identifier !== undefined && slot.identifier)
      .map((slot) => slot.name);

    this.valueValidatorMap = new Map();
  }

  getValidatorForSlot(
    slot: AnonymousSlotExpression | SlotDefinition | string,
    options: GetValidatorsForSlotOptions = {},
  ): ValidatorFn {
    const { cacheKey, inheritedRange } = options;
    if (typeof cacheKey === "string" && this.valueValidatorMap.has(cacheKey)) {
      return this.valueValidatorMap.get(cacheKey)!;
    }

    let slotDefinition: AnonymousSlotExpression | SlotDefinition;
    if (typeof slot === "string") {
      slotDefinition = this.targetClassInducedSlots![slot];
    } else {
      slotDefinition = slot;
    }

    if (!slotDefinition.range && inheritedRange) {
      slotDefinition.range = inheritedRange;
    }

    const slotType = this.schema.types?.[slotDefinition.range!];
    const slotEnum = this.schema.enums?.[slotDefinition.range!];
    const slotPermissibleValues = Object.values(
      slotEnum?.permissible_values ?? {},
    ).map((pv) => pv.text);

    const anyOfValidators = (slotDefinition.any_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, {
        inheritedRange: slotDefinition.range,
      }),
    );
    const allOfValidators = (slotDefinition.all_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, {
        inheritedRange: slotDefinition.range,
      }),
    );
    const exactlyOneOfValidators = (slotDefinition.exactly_one_of ?? []).map(
      (subSlot) =>
        this.getValidatorForSlot(subSlot, {
          inheritedRange: slotDefinition.range,
        }),
    );
    const noneOfValidators = (slotDefinition.none_of ?? []).map((subSlot) =>
      this.getValidatorForSlot(subSlot, {
        inheritedRange: slotDefinition.range,
      }),
    );

    const slotMinimumValue = this.parseMinMaxConstraint(
      slotDefinition.minimum_value,
      slotType?.uri,
    );
    const slotMaximumValue = this.parseMinMaxConstraint(
      slotDefinition.maximum_value,
      slotType?.uri,
    );

    /**
     * Validate a value against a slot definition.
     * @param value - The value to validate
     * @return A string describing the validation issue if the value fails validation, otherwise
     *     undefined if the value passes validation
     */
    const validate = (value: unknown) => {
      const valueDefined = value != null && value !== "";
      if (slotDefinition.required && !valueDefined) {
        return "This field is required";
      }

      if (slotDefinition.value_presence === "PRESENT" && !valueDefined) {
        return "Value is not present";
      } else if (slotDefinition.value_presence === "ABSENT" && valueDefined) {
        return "Value is not absent";
      }

      if (!valueDefined) {
        return;
      }

      let valuesArray: unknown[];
      if ("multivalued" in slotDefinition && slotDefinition.multivalued) {
        valuesArray = value as unknown[];
        if (
          slotDefinition.minimum_cardinality !== undefined &&
          valuesArray.length < slotDefinition.minimum_cardinality
        ) {
          return "Too few entries";
        }
        if (
          slotDefinition.maximum_cardinality !== undefined &&
          valuesArray.length > slotDefinition.maximum_cardinality
        ) {
          return "Too many entries";
        }
      } else {
        valuesArray = [value];
      }

      for (let value of valuesArray) {
        if (slotType) {
          if (slotType.uri === "xsd:string" && typeof value !== "string") {
            return "Value is not a string";
          }
          if (
            slotType.uri === "xsd:integer" &&
            (typeof value !== "number" || !Number.isInteger(value))
          ) {
            return "Value is not an integer";
          }
          if (
            (slotType.uri === "xsd:float" ||
              slotType.uri === "xsd:double" ||
              slotType.uri === "xsd:decimal") &&
            typeof value !== "number"
          ) {
            return "Value is not numeric";
          }
          if (slotType.uri === "xsd:boolean" && typeof value !== "boolean") {
            return "Value is not a boolean";
          }
          if (slotType.uri === "xsd:date") {
            if (typeof value !== "string") {
              return "Value is not a date";
            } else {
              value = parse(value, this.dateFormat, REF_DATE);
              if (Number.isNaN((value as Date).getTime())) {
                return "Value does not match date format";
              }
            }
          }
          if (slotType.uri === "xsd:dateTime") {
            if (typeof value !== "string") {
              return "Value is not a date";
            } else {
              value = parse(value, this.dateTimeFormat, REF_DATE);
              if (Number.isNaN((value as Date).getTime())) {
                return "Value does not match datetime format";
              }
            }
          }

          // @ts-expect-error: unknown value used with less than operator
          if (slotMinimumValue != null && value < slotMinimumValue) {
            return "Value is less than minimum value";
          }
          // @ts-expect-error: unknown value used with greater than operator
          if (slotMaximumValue != null && value > slotMaximumValue) {
            return "Value is greater than maximum value";
          }

          if (
            (slotDefinition.equals_string !== undefined &&
              value !== slotDefinition.equals_string) ||
            (slotDefinition.equals_number !== undefined &&
              value !== slotDefinition.equals_number)
          ) {
            return "Value does not match constant";
          }

          if (
            slotDefinition.pattern !== undefined &&
            typeof value === "string" &&
            !value.match(slotDefinition.pattern)
          ) {
            return "Value does not match pattern";
          }
        }

        if (
          slotEnum &&
          !(typeof value === "string" && slotPermissibleValues.includes(value))
        ) {
          return "Value is not allowed";
        }

        if (anyOfValidators.length) {
          const results = anyOfValidators.map((fn) => fn(value));
          const valid = results.some((result) => result === undefined);
          if (!valid) {
            return results.join("\n");
          }
        }

        if (allOfValidators.length) {
          const results = allOfValidators.map((fn) => fn(value));
          const valid = results.every((result) => result === undefined);
          if (!valid) {
            return results.filter((result) => result !== undefined).join("\n");
          }
        }

        if (exactlyOneOfValidators.length) {
          const results = exactlyOneOfValidators.map((fn) => fn(value));
          const valid =
            results.filter((result) => result === undefined).length === 1;
          if (!valid) {
            const messages = results.filter((result) => result !== undefined);
            if (!messages.length) {
              return "All expressions of exactly_one_of held";
            } else {
              return results
                .filter((result) => result !== undefined)
                .join("\n");
            }
          }
        }

        if (noneOfValidators.length) {
          const results = noneOfValidators.map((fn) => fn(value));
          const valid = results.every((result) => result !== undefined);
          if (!valid) {
            return "One or more expressions of none_of held";
          }
        }
      }
    };

    if (typeof cacheKey === "string") {
      this.valueValidatorMap.set(cacheKey, validate);
    }

    return validate;
  }

  validate(data: Record<string, unknown>[]) {
    this.results = {};

    // Build a record of empty indices for later use
    const nonEmptyRowNumbers: number[] = [];
    for (let idx = 0; idx < data.length; idx += 1) {
      const nonEmpty = Object.values(data[idx]).some(
        (val) => val != null && val !== "",
      );
      if (nonEmpty) {
        nonEmptyRowNumbers.push(idx);
      }
    }

    // Iterate over each row and each column performing the validation that can
    // be performed atomically on the value in the cell according to the column's
    // slot.
    for (let idx = 0; idx < data.length; idx += 1) {
      if (!nonEmptyRowNumbers.includes(idx)) {
        continue;
      }
      for (const slotName of Object.keys(this.targetClassInducedSlots!)) {
        const valueValidator = this.getValidatorForSlot(slotName, {
          cacheKey: slotName,
        });
        const result = valueValidator(data[idx][slotName]);
        if (result !== undefined) {
          this.addResult(idx, slotName, result);
        }
      }
    }

    // Validate that each column representing an identifier slot contains unique values
    for (const identifier of this.identifiers) {
      this.doUniquenessValidation(
        [identifier],
        data,
        nonEmptyRowNumbers,
        `Duplicate identifier not allowed`,
      );
    }

    // Validate that each group of columns representing unique_keys contains unique values
    for (const uniqueKeysDefinition of Object.values(
      this.targetClass?.unique_keys || {},
    )) {
      this.doUniquenessValidation(
        uniqueKeysDefinition.unique_key_slots,
        data,
        nonEmptyRowNumbers,
        `Duplicate values for unique key ${uniqueKeysDefinition.unique_key_name} not allowed`,
      );
    }

    const rules = this.targetClass?.rules ?? [];
    for (let idx = 0; idx < rules.length; idx += 1) {
      const rule = rules[idx];
      if (rule.deactivated) {
        continue;
      }

      const preConditions = this.buildSlotConditionGettersAndValidators(
        rule.preconditions,
        `rule-${idx}-preconditions`,
      );
      if (preConditions.length === 0) {
        continue;
      }

      const postConditions = this.buildSlotConditionGettersAndValidators(
        rule.postconditions,
        `rule-${idx}-postconditions`,
      );
      const elseConditions = this.buildSlotConditionGettersAndValidators(
        rule.elseconditions,
        `rule-${idx}-elseconditions`,
      );

      for (let row = 0; row < data.length; row += 1) {
        const preConditionsMet = preConditions.every(([getter, validator]) => {
          const [, value] = getter(data[row]);
          return validator(value) === undefined;
        });
        if (preConditionsMet) {
          postConditions.forEach(([getter, validator]) => {
            const [slotName, value] = getter(data[row]);
            const result = validator(value);
            if (result !== undefined) {
              this.addResult(row, slotName, result);
            }
          });
        } else {
          elseConditions.forEach(([getter, validator]) => {
            const [slotName, value] = getter(data[row]);
            const result = validator(value);
            if (result !== undefined) {
              this.addResult(row, slotName, result);
            }
          });
        }
      }
    }

    return this.results;
  }

  private addResult(row: number, slot: string, message: string) {
    if (this.results[row] === undefined) {
      this.results[row] = {};
    }
    this.results[row][slot] = message;
  }

  private parseMinMaxConstraint(
    value: unknown | undefined,
    type: string | undefined,
  ): unknown | undefined {
    let parsed;
    if (typeof value === "string") {
      if (type === "xsd:date") {
        parsed = parse(value, this.dateFormat, REF_DATE);
      } else if (type === "xsd:dateTime") {
        parsed = parse(value, this.dateTimeFormat, REF_DATE);
      }
      if (parsed !== undefined && Number.isNaN(parsed.getTime())) {
        return;
      }
    } else {
      parsed = value;
    }
    return parsed;
  }

  private doUniquenessValidation(
    slotNames: string[],
    data: Record<string, unknown>[],
    nonEmptyRowNumbers: number[],
    message: string,
  ) {
    const columnData = data
      .filter((row, rowNumber) => nonEmptyRowNumbers.includes(rowNumber))
      .map((row) => slotNames.map((column) => row[column]));
    const isUnique = validateUniqueValues([columnData]);
    for (let idx = 0; idx < isUnique.length; idx += 1) {
      if (isUnique[idx]) {
        continue;
      }
      const row = nonEmptyRowNumbers[idx];
      for (const slot of slotNames) {
        this.addResult(row, slot, message);
      }
    }
  }

  private buildSlotConditionGettersAndValidators(
    classExpression: ClassExpression | undefined,
    cachePrefix: string,
  ) {
    return Object.values(classExpression?.slot_conditions || {}).map(
      (
        slotCondition,
      ): [(row: Record<string, unknown>) => [string, unknown], ValidatorFn] => {
        const getter: (row: Record<string, unknown>) => [string, unknown] = (
          row: Record<string, unknown>,
        ) => [slotCondition.name, row[slotCondition.name]];
        let inheritedRange = undefined;
        if (!slotCondition.range) {
          inheritedRange =
            this.targetClassInducedSlots?.[slotCondition.name].range;
        }
        const validator = this.getValidatorForSlot(slotCondition, {
          inheritedRange,
          cacheKey: `${cachePrefix}-${slotCondition.name}`,
        });
        return [getter, validator];
      },
    );
  }
}

export default Validator;
