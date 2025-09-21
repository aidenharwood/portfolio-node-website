export interface ProjectMeta {
  title: string;
  description: string;
  date: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  image?: string;
  github?: string;
  demo?: string;
  featured?: boolean;
  body?: string;
  rawContent?: string;
  file?: string;
}

export async function getAllProjects(): Promise<ProjectMeta[]> {
  const res = await fetch(`/api/projects`);
  return await res.json();
}

export async function fetchProject(slug: string): Promise<ProjectMeta | null> {
  const res = await fetch(`/api/projects/${slug}`);
  if (!res.ok) return null;
  return await res.json();
}