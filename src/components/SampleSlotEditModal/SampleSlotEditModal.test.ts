import { getSelectState } from "./SampleSlotEditModal";
import { SchemaDefinition } from "../../linkml-metamodel";
import { GoldEcosystemTreeNode, SampleDataValue } from "../../api";

const MOCK_SCHEMA: SchemaDefinition = {
  id: "http://example.org/test",
  name: "test",
  slots: {
    a_string: {
      name: "a_string",
      range: "string",
    },
    a_choice: {
      name: "a_choice",
      range: "Choice",
    },
    a_choice_or_string: {
      name: "a_choice_or_string",
      any_of: [{ range: "string" }, { range: "Choice" }],
    },
  },
  enums: {
    Choice: {
      name: "Choice",
      permissible_values: {
        a: { text: "a" },
        b: { text: "b" },
      },
    },
  },
};

const MOCK_GOLD_TREE: GoldEcosystemTreeNode = {
  name: "test",
  children: [],
};

const MOCK_SAMPLE_DATA: Record<string, SampleDataValue> = {};

const MOCK_SAMPLE_DATA_GETTER = (name: string) => MOCK_SAMPLE_DATA[name];

describe("getSelectState", () => {
  it("should return isSelectable = false when slot is null", () => {
    const state = getSelectState(
      MOCK_SCHEMA,
      null,
      MOCK_SAMPLE_DATA_GETTER,
      MOCK_GOLD_TREE,
    );
    expect(state.isSelectable).toBe(false);
  });

  it("should return isSelectable = false when the slot range is string", () => {
    const state = getSelectState(
      MOCK_SCHEMA,
      MOCK_SCHEMA.slots!["a_string"],
      MOCK_SAMPLE_DATA_GETTER,
      MOCK_GOLD_TREE,
    );
    expect(state.isSelectable).toBe(false);
  });

  it("should return isSelectable = true when the slot range is string", () => {
    const state = getSelectState(
      MOCK_SCHEMA,
      MOCK_SCHEMA.slots!["a_choice"],
      MOCK_SAMPLE_DATA_GETTER,
      MOCK_GOLD_TREE,
    );
    expect(state.isSelectable).toBe(true);
    expect(state.permissibleValues).toEqual({
      a: { text: "a" },
      b: { text: "b" },
    });
  });

  it("should return isSelectable = true when the slot range is any_of", () => {
    const state = getSelectState(
      MOCK_SCHEMA,
      MOCK_SCHEMA.slots!["a_choice_or_string"],
      MOCK_SAMPLE_DATA_GETTER,
      MOCK_GOLD_TREE,
    );
    expect(state.isSelectable).toBe(true);
    expect(state.permissibleValues).toEqual({
      a: { text: "a" },
      b: { text: "b" },
    });
  });
});
