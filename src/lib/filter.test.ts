import { describe, it, expect } from "vitest";
import { filterProjects } from "./filter";
import type { Project } from "../data/projects";

const sample: Project[] = [
  { id: "a", client: "A", title: "A", category: "social", services: [] },
  { id: "b", client: "B", title: "B", category: "film", services: [] },
  { id: "c", client: "C", title: "C", category: "audio", services: [] },
  { id: "d", client: "D", title: "D", category: "film", services: [] },
];

describe("filterProjects", () => {
  it("returns all projects for category 'all'", () => {
    expect(filterProjects(sample, "all")).toHaveLength(4);
  });

  it("returns only projects of the given category", () => {
    const film = filterProjects(sample, "film");
    expect(film).toHaveLength(2);
    expect(film.every((p) => p.category === "film")).toBe(true);
  });

  it("returns empty array when no project matches", () => {
    const none = filterProjects([], "social");
    expect(none).toEqual([]);
  });

  it("does not mutate the input array", () => {
    const copy = [...sample];
    filterProjects(sample, "film");
    expect(sample).toEqual(copy);
  });
});
