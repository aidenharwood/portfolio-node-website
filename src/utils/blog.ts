import fm from "front-matter";
import { marked } from "marked";
import slugify from "slugify";

const postFiles = import.meta.glob("../blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export interface BlogPostMeta {
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
  body: string | Promise<string>;
  file: string;
}

export function getAllPosts(): BlogPostMeta[] {
  return Object.entries(postFiles)
    .map(([file, raw]) => {
      const { attributes, body } = fm<BlogPostMeta>(raw as string)
      const slug = slugify(attributes.title || file, { lower: true, strict: true })
      return {
        title: attributes.title || file,
        date: attributes.date || file.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "",
        slug,
        excerpt: attributes.excerpt || body.slice(0, 120) + "...",
        body: marked.parse(body),
        file,
      }
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}
