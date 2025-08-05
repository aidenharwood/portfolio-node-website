export interface BlogPostMeta {
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
  body?: string;
  file?: string;
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const res = await fetch(`/api/posts`);
  return await res.json();
}

export async function fetchPost(slug: string): Promise<BlogPostMeta | null> {
  const res = await fetch(`/api/posts/${slug}`);
  if (!res.ok) return null;
  return await res.json();
}
