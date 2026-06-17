import { describe, it, expect } from "vitest";
import { currentStatValue, WEEK_MS, type StatDef } from "./stats";

const shorts: StatDef = { label: "Shorts", base: 3500, perWeek: 10 };
const podcasts: StatDef = { label: "Podcasts", base: 130, perWeek: 0 };
const anchor = 1_000_000_000_000;

describe("currentStatValue", () => {
  it("returns base at the anchor moment", () => {
    expect(currentStatValue(shorts, anchor, anchor)).toBe(3500);
  });

  it("adds perWeek for each full week elapsed", () => {
    expect(currentStatValue(shorts, anchor + WEEK_MS, anchor)).toBe(3510);
    expect(currentStatValue(shorts, anchor + 3 * WEEK_MS, anchor)).toBe(3530);
  });

  it("ignores partial weeks (floors down)", () => {
    expect(currentStatValue(shorts, anchor + WEEK_MS + 1, anchor)).toBe(3510);
    expect(currentStatValue(shorts, anchor + WEEK_MS - 1, anchor)).toBe(3500);
  });

  it("never drops below base for dates before the anchor", () => {
    expect(currentStatValue(shorts, anchor - 5 * WEEK_MS, anchor)).toBe(3500);
  });

  it("keeps constant stats (perWeek 0) unchanged", () => {
    expect(currentStatValue(podcasts, anchor + 10 * WEEK_MS, anchor)).toBe(130);
  });
});
