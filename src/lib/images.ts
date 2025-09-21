/**
 * Get list of available image paths (including nested directories)
 */
export async function getAllImages(): Promise<string[]> {
  const res = await fetch(`/images`);
  return await res.json();
}

/**
 * Get the full URL for an image by path (supports nested paths)
 * @param imagePath - Can be "image.png" or "projects/image.png" or "path/to/image.png"
 */
export function getImageUrl(imagePath: string): string {
  return `/images/${imagePath}`;
}

/**
 * Get the API URL for an image by filename (flat structure only)
 */
export function getApiImageUrl(filename: string): string {
  return `/images/${filename}`;
}