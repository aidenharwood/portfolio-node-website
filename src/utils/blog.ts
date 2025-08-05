export interface BlogPostMeta {
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
  body?: string;
  file?: string;
}

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const res = await fetch(`${apiUrl}/api/posts`);
  return await res.json();
}

export async function fetchPost(slug: string): Promise<BlogPostMeta | null> {
  const res = await fetch(`${apiUrl}/api/posts/${slug}`);
  if (!res.ok) return null;
  return await res.json();
}
