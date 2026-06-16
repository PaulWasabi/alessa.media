import type { Project, Category } from "../data/projects";

export function filterProjects(
  projects: Project[],
  category: Category | "all",
): Project[] {
  if (category === "all") return [...projects];
  return projects.filter((p) => p.category === category);
}
