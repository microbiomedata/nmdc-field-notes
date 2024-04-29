import { isValidColorPaletteMode } from "./colorPalette";

describe("isValidColorPaletteMode", () => {
  it("recognizes valid color palette modes", () => {
    expect(isValidColorPaletteMode("Light")).toBe(true);
    expect(isValidColorPaletteMode("Dark")).toBe(true);
    expect(isValidColorPaletteMode("System")).toBe(true);
  });
  it("detects invalid color palette modes", () => {
    expect(isValidColorPaletteMode("Potato")).toBe(false);
    expect(isValidColorPaletteMode(null)).toBe(false);
  });
});
