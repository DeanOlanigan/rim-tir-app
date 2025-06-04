import { describe, it, expect } from "vitest";
import {
    getStartDate,
    getEndDate,
    getRandomColor,
} from "../src/utils/utils.js";

describe("utils date functions", () => {
    it("getStartDate returns a number", () => {
        const value = getStartDate();
        expect(typeof value).toBe("number");
    });

    it("getEndDate returns a number", () => {
        const value = getEndDate();
        expect(typeof value).toBe("number");
    });
});

describe("getRandomColor", () => {
    it("returns a valid hex color", () => {
        const color = getRandomColor();
        expect(typeof color).toBe("string");
        expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });
});
