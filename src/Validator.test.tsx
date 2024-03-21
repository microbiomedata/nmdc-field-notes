import Validator from "./Validator";
import {
  ClassDefinition,
  SchemaDefinition,
  TypeDefinition,
} from "./linkml-metamodel";

const STANDARD_TYPES: Record<string, TypeDefinition> = {
  string: {
    name: "string",
    uri: "xsd:string",
  },
  integer: {
    name: "integer",
    uri: "xsd:integer",
  },
  float: {
    name: "float",
    uri: "xsd:float",
  },
  double: {
    name: "double",
    uri: "xsd:double",
  },
  decimal: {
    name: "decimal",
    uri: "xsd:decimal",
  },
  date: {
    name: "date",
    uri: "xsd:date",
  },
  dateTime: {
    name: "dateTime",
    uri: "xsd:dateTime",
  },
  time: {
    name: "time",
    uri: "xsd:time",
  },
};

function buildTestSchema(
  testClassDefinition: Partial<ClassDefinition> = {},
): SchemaDefinition {
  return {
    id: "test-schema",
    name: "test-schema",
    types: STANDARD_TYPES,
    classes: {
      Test: {
        name: "Test",
        ...testClassDefinition,
      },
    },
    enums: {
      Numbers: {
        name: "Numbers",
        permissible_values: {
          One: { text: "One" },
          Two: { text: "Two" },
          Three: { text: "Three" },
        },
      },
    },
  };
}

test("Validator should validate string types", () => {
  const schema = buildTestSchema({
    attributes: {
      a_string: {
        name: "a_string",
        range: "string",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");
  const fn = validator.getValidatorForSlot("a_string");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("hello")).toBeUndefined();
  expect(fn("")).toBeUndefined();
  expect(fn(1)).toEqual("Value is not a string");
});

test("Validator should validate numeric types", () => {
  const schema = buildTestSchema({
    attributes: {
      an_integer: {
        name: "an_integer",
        range: "integer",
      },
      a_float: {
        name: "a_float",
        range: "float",
      },
      a_double: {
        name: "a_double",
        range: "double",
      },
      a_decimal: {
        name: "a_decimal",
        range: "decimal",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  let fn = validator.getValidatorForSlot("an_integer");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(14)).toBeUndefined();
  expect(fn(-14)).toBeUndefined();
  expect(fn(3.1415)).toEqual("Value is not an integer");

  fn = validator.getValidatorForSlot("a_float");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(3.1415)).toBeUndefined();
  expect(fn("hello")).toEqual("Value is not correct numeric format");

  fn = validator.getValidatorForSlot("a_double");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(3.1415)).toBeUndefined();
  expect(fn("hello")).toEqual("Value is not correct numeric format");

  fn = validator.getValidatorForSlot("a_decimal");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(3.1415)).toBeUndefined();
  expect(fn(-0.071)).toBeUndefined();
  expect(fn("hello")).toEqual("Value is not correct numeric format");
});

test("Validator should validate enum types", () => {
  const schema = buildTestSchema({
    attributes: {
      an_enum: {
        name: "an_enum",
        range: "Numbers",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("an_enum");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("One")).toBeUndefined();
  expect(fn("Whatever")).toEqual("Value is not allowed");
});

it("should validate date and time types", () => {
  const schema = buildTestSchema({
    attributes: {
      a_date: {
        name: "a_date",
        range: "date",
      },
      a_datetime: {
        name: "a_datetime",
        range: "dateTime",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  let fn = validator.getValidatorForSlot("a_date");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("2022-02-22")).toBeUndefined();
  expect(fn("whoops")).toEqual("Value does not match date format");

  fn = validator.getValidatorForSlot("a_datetime");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("2022-02-22 02:22")).toBeUndefined();
  expect(fn("whoops")).toEqual("Value does not match datetime format");
});

test("Validator should validate required fields", () => {
  const schema = buildTestSchema({
    attributes: {
      required_string: {
        name: "required_string",
        range: "string",
        required: true,
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("required_string");
  expect(fn("correct")).toBeUndefined();
  expect(fn("")).toEqual("This field is required");
  expect(fn(undefined)).toEqual("This field is required");
});

test("Validator should validate minimum and maximum numeric constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      a_big_number: {
        name: "a_big_number",
        range: "integer",
        minimum_value: 100,
      },
      a_small_number: {
        name: "a_small_number",
        range: "integer",
        maximum_value: 10,
      },
      a_medium_number: {
        name: "a_medium_number",
        range: "integer",
        minimum_value: 25,
        maximum_value: 75,
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  let fn = validator.getValidatorForSlot("a_big_number");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(123)).toBeUndefined();
  expect(fn(99)).toEqual("Value is less than minimum value");

  fn = validator.getValidatorForSlot("a_small_number");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(9)).toBeUndefined();
  expect(fn(11)).toEqual("Value is greater than maximum value");

  fn = validator.getValidatorForSlot("a_medium_number");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(50)).toBeUndefined();
  expect(fn(11)).toEqual("Value is less than minimum value");
  expect(fn(82)).toEqual("Value is greater than maximum value");
});

test("Validator should validate minimum and maximum date constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      during_vancouver_olympics: {
        name: "during_vancouver_olympics",
        range: "date",
        minimum_value: "2010-02-12",
        maximum_value: "2010-02-28",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("during_vancouver_olympics");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("2010-01-01")).toEqual("Value is less than minimum value");
  expect(fn("2010-02-20")).toBeUndefined();
  expect(fn("2010-03-01")).toEqual("Value is greater than maximum value");
});

test("Validator should validate constant constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      a_constant: {
        name: "a_constant",
        range: "string",
        equals_string: "const",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("a_constant");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("const")).toBeUndefined();
  expect(fn("whoops")).toEqual("Value does not match constant");
});

test("Validator should validate pattern constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      zip_code: {
        name: "zip_code",
        range: "string",
        pattern: "^[0-9]{5}(?:-[0-9]{4})?$",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("zip_code");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("99362")).toBeUndefined();
  expect(fn("99362-1234")).toBeUndefined();
  expect(fn("whatever")).toEqual("Value does not match pattern");
});

test("Validator should validate any_of constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      an_integer_or_enum: {
        name: "an_integer_or_enum",
        any_of: [{ range: "Numbers" }, { range: "integer" }],
      },
      a_big_or_small_number: {
        name: "a_big_or_small_number",
        range: "integer",
        any_of: [{ maximum_value: 10 }, { minimum_value: 100 }],
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  let fn = validator.getValidatorForSlot("an_integer_or_enum");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("One")).toBeUndefined();
  expect(fn(99)).toBeUndefined();
  expect(fn(99.99)).toEqual("Value is not allowed\nValue is not an integer");

  fn = validator.getValidatorForSlot("a_big_or_small_number");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(9)).toBeUndefined();
  expect(fn(101)).toBeUndefined();
  expect(fn(50)).toEqual(
    "Value is greater than maximum value\nValue is less than minimum value",
  );
  expect(fn("hello")).toEqual("Value is not an integer");
});

test("Validator should validate all_of constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      unsatisfiable: {
        name: "unsatisfiable",
        all_of: [
          {
            range: "string",
            equals_string: "zero",
          },
          {
            range: "integer",
            equals_number: 0,
          },
        ],
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("unsatisfiable");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("zero")).toEqual("Value is not an integer");
  expect(fn(0)).toEqual("Value is not a string");
});

test("Validator should validate exactly_one_of constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      an_integer_in_exactly_one_interval: {
        name: "an_integer_in_exactly_one_interval",
        range: "integer",
        exactly_one_of: [
          {
            minimum_value: 0,
            maximum_value: 20,
          },
          {
            minimum_value: 10,
            maximum_value: 30,
          },
        ],
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot(
    "an_integer_in_exactly_one_interval",
  );
  expect(fn(undefined)).toBeUndefined();
  expect(fn(5)).toBeUndefined();
  expect(fn(15)).toEqual("All expressions of exactly_one_of held");
  expect(fn(25)).toBeUndefined();
  expect(fn(35)).toEqual(
    "Value is greater than maximum value\nValue is greater than maximum value",
  );
});

test("Validator should validate none_of constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      no_bad_words: {
        name: "no_bad_words",
        range: "string",
        none_of: [{ equals_string: "cuss" }, { equals_string: "swear" }],
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("no_bad_words");
  expect(fn(undefined)).toBeUndefined();
  expect(fn("this is okay")).toBeUndefined();
  expect(fn("cuss")).toEqual("One or more expressions of none_of held");
  expect(fn("swear")).toEqual("One or more expressions of none_of held");
});

test("Validator should validate multivalued slots", () => {
  const schema = buildTestSchema({
    attributes: {
      many_strings: {
        name: "many_strings",
        range: "string",
        multivalued: true,
      },
      many_enums: {
        name: "many_enums",
        range: "Numbers",
        multivalued: true,
      },
      many_small_integers: {
        name: "many_small_integers",
        range: "integer",
        multivalued: true,
        maximum_value: 10,
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  let fn = validator.getValidatorForSlot("many_strings");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(["one"])).toBeUndefined();
  expect(fn(["one", "two", "three"])).toBeUndefined();

  fn = validator.getValidatorForSlot("many_enums");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(["One"])).toBeUndefined();
  expect(fn(["One", "Two", "Three"])).toBeUndefined();
  expect(fn(["One", "whoops", "Three"])).toEqual("Value is not allowed");

  fn = validator.getValidatorForSlot("many_small_integers");
  expect(fn(undefined)).toBeUndefined();
  expect(fn([1])).toBeUndefined();
  expect(fn([1, 2, 3])).toBeUndefined();
  expect(fn([1, 2.2, 3])).toEqual("Value is not an integer");
  expect(fn([1, 2, "whoops"])).toEqual("Value is not an integer");
  expect(fn([11, 2, 3])).toEqual("Value is greater than maximum value");
});

test("Validator should validate multivalued cardinality constraints", () => {
  const schema = buildTestSchema({
    attributes: {
      just_a_few_strings: {
        name: "just_a_few_strings",
        range: "string",
        multivalued: true,
        minimum_cardinality: 2,
        maximum_cardinality: 4,
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const fn = validator.getValidatorForSlot("just_a_few_strings");
  expect(fn(undefined)).toBeUndefined();
  expect(fn(["one"])).toEqual("Too few entries");
  expect(fn(["one", "two", "three"])).toBeUndefined();
  expect(fn(["one", "two", "three", "four", "five"])).toEqual(
    "Too many entries",
  );
});

it("should validate the slots of each row", () => {
  const schema = buildTestSchema({
    attributes: {
      required_string: {
        name: "required_string",
        range: "string",
        required: true,
      },
      a_string: {
        name: "a_string",
        range: "string",
      },
      an_integer: {
        name: "an_integer",
        range: "integer",
      },
      an_enum: {
        name: "an_enum",
        range: "Numbers",
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const data = [
    {
      required_string: "hello",
      a_string: "world",
      an_integer: 1,
      an_enum: "One",
    },
    {
      required_string: "",
      a_string: "wassup",
      an_integer: 2.2,
      an_enum: "Four",
    },
  ];
  const results = validator.validate(data);
  expect(results).toEqual({
    1: {
      required_string: "This field is required",
      an_integer: "Value is not an integer",
      an_enum: "Value is not allowed",
    },
  });
});

test("Validator should validate the uniqueness of identifiers", () => {
  const schema = buildTestSchema({
    attributes: {
      an_identifier: {
        name: "an_identifier",
        range: "string",
        identifier: true,
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const data = [
    { an_identifier: "one" },
    { an_identifier: "two" },
    { an_identifier: "" },
    { an_identifier: "" },
    { an_identifier: "" },
    { an_identifier: "one" },
    { an_identifier: "three" },
  ];
  const results = validator.validate(data);
  expect(results).toEqual({
    0: { an_identifier: "Duplicate identifier not allowed" },
    5: { an_identifier: "Duplicate identifier not allowed" },
  });
});

test("Validator should validate the uniqueness of unique keys", () => {
  const schema = buildTestSchema({
    attributes: {
      unique_key_part_a: {
        name: "unique_key_part_a",
        range: "string",
      },
      unique_key_part_b: {
        name: "unique_key_part_b",
        range: "string",
      },
    },
    unique_keys: {
      a_two_part_unique_key: {
        unique_key_name: "a_two_part_unique_key",
        unique_key_slots: ["unique_key_part_a", "unique_key_part_b"],
      },
    },
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const data = [
    { unique_key_part_a: "one", unique_key_part_b: "two" },
    { unique_key_part_a: "three", unique_key_part_b: "four" },
    { unique_key_part_a: "", unique_key_part_b: "" },
    { unique_key_part_a: "three", unique_key_part_b: "" },
    { unique_key_part_a: "", unique_key_part_b: "four" },
    { unique_key_part_a: "", unique_key_part_b: "" },
    { unique_key_part_a: "one", unique_key_part_b: "three" },
    { unique_key_part_a: "two", unique_key_part_b: "two" },
    { unique_key_part_a: "three", unique_key_part_b: "four" },
    { unique_key_part_a: "", unique_key_part_b: "four" },
    { unique_key_part_a: "three", unique_key_part_b: "three" },
  ];
  const results = validator.validate(data);
  expect(results).toEqual({
    1: {
      unique_key_part_a:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
      unique_key_part_b:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
    },
    4: {
      unique_key_part_a:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
      unique_key_part_b:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
    },
    8: {
      unique_key_part_a:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
      unique_key_part_b:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
    },
    9: {
      unique_key_part_a:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
      unique_key_part_b:
        "Duplicate values for unique key a_two_part_unique_key not allowed",
    },
  });
});

test("Validator should validate rules with preconditions and postconditions", () => {
  const schema = buildTestSchema({
    attributes: {
      rule_1_precondition_string: {
        name: "rule_1_precondition_string",
        range: "string",
      },
      rule_1_postcondition_integer: {
        name: "rule_1_postcondition_integer",
        range: "integer",
      },
      rule_1_postcondition_float: {
        name: "rule_1_postcondition_float",
        range: "float",
      },
    },
    rules: [
      {
        title: "rule 1",
        description:
          "If rule_1_precondition_string is either bingo or bongo then rule_1_postcondition_integer " +
          "has to be >= 100 and rule_1_postcondition_float has to be <= 0",
        preconditions: {
          slot_conditions: {
            rule_1_precondition_string: {
              name: "rule_1_precondition_string",
              any_of: [{ equals_string: "bingo" }, { equals_string: "bongo" }],
            },
          },
        },
        postconditions: {
          slot_conditions: {
            rule_1_postcondition_integer: {
              name: "rule_1_postcondition_integer",
              minimum_value: 100,
            },
            rule_1_postcondition_float: {
              name: "rule_1_postcondition_float",
              maximum_value: 0,
            },
          },
        },
      },
    ],
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const data = [
    {
      rule_1_precondition_string: "whatever",
      rule_1_postcondition_integer: 20,
      rule_1_postcondition_float: 20,
    },
    {
      rule_1_precondition_string: "bingo",
      rule_1_postcondition_integer: 200,
      rule_1_postcondition_float: -10,
    },
    {
      rule_1_precondition_string: "bongo",
      rule_1_postcondition_integer: 99,
      rule_1_postcondition_float: -30,
    },
  ];
  const results = validator.validate(data);
  expect(results).toEqual({
    2: {
      rule_1_postcondition_integer: "Value is less than minimum value",
    },
  });
});

test("Validator should validate rules with preconditions, postconditions, and elseconditions", () => {
  const schema = buildTestSchema({
    attributes: {
      rule_2_conditional_string: {
        name: "rule_2_conditional_string",
        range: "string",
      },
      rule_2_big_number: {
        name: "rule_2_big_number",
        range: "integer",
        minimum_value: 100,
      },
      rule_2_small_number: {
        name: "rule_2_small_number",
        range: "integer",
        maximum_value: 10,
      },
    },
    rules: [
      {
        title: "rule 2",
        description:
          "If rule_2_conditional_string is 'big' then rule_2_big_number is required, otherwise rule_2_small_number is required",
        preconditions: {
          slot_conditions: {
            rule_2_conditional_string: {
              name: "rule_2_conditional_string",
              equals_string: "big",
            },
          },
        },
        postconditions: {
          slot_conditions: {
            rule_2_big_number: {
              name: "rule_2_big_number",
              required: true,
            },
          },
        },
        elseconditions: {
          slot_conditions: {
            rule_2_small_number: {
              name: "rule_2_small_number",
              required: true,
            },
          },
        },
      },
    ],
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const data = [
    {
      rule_2_conditional_string: "big",
      rule_2_big_number: 20,
    },
    {
      rule_2_conditional_string: "big",
      rule_2_big_number: 200,
    },
    {
      rule_2_conditional_string: "big",
      rule_2_small_number: 3,
    },
    {
      rule_2_conditional_string: "whatever",
      rule_2_small_number: 30,
    },
    {
      rule_2_conditional_string: "whatever",
      rule_2_small_number: 3,
    },
    {
      rule_2_conditional_string: "whatever",
      rule_2_big_number: 200,
    },
  ];
  const results = validator.validate(data);
  expect(results).toEqual({
    0: {
      rule_2_big_number: "Value is less than minimum value",
    },
    2: {
      rule_2_big_number: "This field is required",
    },
    3: {
      rule_2_small_number: "Value is greater than maximum value",
    },
    5: {
      rule_2_small_number: "This field is required",
    },
  });
});

test("Validator should validate value_presence: PRESENT rules", () => {
  const schema = buildTestSchema({
    attributes: {
      rule_3_present_or_absent_string: {
        name: "rule_3_present_or_absent_string",
        range: "string",
      },
      rule_3_big_number: {
        name: "rule_3_big_number",
        range: "integer",
        minimum_value: 100,
      },
    },
    rules: [
      {
        title: "rule 3",
        description:
          "If rule_3_present_or_absent_string is present, then rule_3_big_number is required",
        preconditions: {
          slot_conditions: {
            rule_3_present_or_absent_string: {
              name: "rule_3_present_or_absent_string",
              value_presence: "PRESENT",
            },
          },
        },
        postconditions: {
          slot_conditions: {
            rule_3_big_number: {
              name: "rule_3_big_number",
              required: true,
            },
          },
        },
      },
    ],
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const data = [
    { rule_3_present_or_absent_string: "", rule_3_big_number: "" },
    { rule_3_present_or_absent_string: "hello", rule_3_big_number: 200 },
    { rule_3_present_or_absent_string: "hello", rule_3_big_number: "" },
  ];
  const results = validator.validate(data);
  expect(results).toEqual({
    2: {
      rule_3_big_number: "This field is required",
    },
  });
});

test("Validator should validate value_presence: ABSENT rules", () => {
  const schema = buildTestSchema({
    attributes: {
      rule_4_present_or_absent_string: {
        name: "rule_4_present_or_absent_string",
        range: "string",
      },
      rule_4_small_number: {
        name: "rule_4_small_number",
        range: "integer",
        maximum_value: 10,
      },
    },
    rules: [
      {
        title: "rule 4",
        description:
          "If rule_4_present_or_absent_string is absent, then rule_4_small_number is required",
        preconditions: {
          slot_conditions: {
            rule_4_present_or_absent_string: {
              name: "rule_4_present_or_absent_string",
              value_presence: "ABSENT",
            },
          },
        },
        postconditions: {
          slot_conditions: {
            rule_4_small_number: {
              name: "rule_4_small_number",
              required: true,
            },
          },
        },
      },
    ],
  });
  const validator = new Validator(schema);
  validator.useTargetClass("Test");

  const data = [
    { rule_4_present_or_absent_string: "", rule_4_small_number: "" },
    { rule_4_present_or_absent_string: "hello", rule_4_small_number: "" },
    { rule_4_present_or_absent_string: "", rule_4_small_number: 5 },
  ];
  const results = validator.validate(data);
  expect(results).toEqual({
    0: {
      rule_4_small_number: "This field is required",
    },
  });
});
