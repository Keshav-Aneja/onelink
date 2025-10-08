import { describe, it, expect, vi, afterEach } from "vitest";
import { getRandomColor } from "./get-random-color";

describe("getRandomColor", () => {
  const validColors = [
    "#FF5733",
    "#FF8C00",
    "#FFD700",
    "#ADFF2F",
    "#32CD32",
    "#00FA9A",
    "#00CED1",
    "#1E90FF",
    "#4169E1",
    "#8A2BE2",
    "#FF00FF",
    "#FF1493",
    "#DC143C",
    "#FF4500",
    "#DAA520",
    "#7FFF00",
    "#40E0D0",
    "#9932CC",
    "#FF69B4",
    "#FF6347",
  ];

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return a valid hex color", () => {
    const color = getRandomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("should return a color from the predefined list", () => {
    const color = getRandomColor();
    expect(validColors).toContain(color);
  });

  it("should return different colors on multiple calls (probabilistic)", () => {
    const colors = new Set<string>();

    // Call the function multiple times
    for (let i = 0; i < 100; i++) {
      colors.add(getRandomColor());
    }

    // With 100 calls and 20 colors, we should get at least 10 different colors
    expect(colors.size).toBeGreaterThan(10);
  });

  it("should return first color when Math.random returns 0", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const color = getRandomColor();
    expect(color).toBe("#FF5733");
  });

  it("should return last color when Math.random returns value close to 1", () => {
    // Math.random() returns [0, 1), so 0.99 * 20 = 19.8, floor = 19
    vi.spyOn(Math, "random").mockReturnValue(0.99);
    const color = getRandomColor();
    expect(color).toBe("#FF6347");
  });

  it("should return middle color when Math.random returns 0.5", () => {
    // 0.5 * 20 = 10, floor = 10
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const color = getRandomColor();
    expect(color).toBe("#FF00FF");
  });

  it("should handle Math.random returning 0.25", () => {
    // 0.25 * 20 = 5, floor = 5
    vi.spyOn(Math, "random").mockReturnValue(0.25);
    const color = getRandomColor();
    expect(color).toBe("#00FA9A");
  });

  it("should handle Math.random returning 0.75", () => {
    // 0.75 * 20 = 15, floor = 15
    vi.spyOn(Math, "random").mockReturnValue(0.75);
    const color = getRandomColor();
    expect(color).toBe("#7FFF00");
  });

  it("should never return undefined", () => {
    for (let i = 0; i < 50; i++) {
      const color = getRandomColor();
      expect(color).toBeDefined();
    }
  });

  it("should never return null", () => {
    for (let i = 0; i < 50; i++) {
      const color = getRandomColor();
      expect(color).not.toBeNull();
    }
  });

  it("should always return a string", () => {
    for (let i = 0; i < 50; i++) {
      const color = getRandomColor();
      expect(typeof color).toBe("string");
    }
  });
});
