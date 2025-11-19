import type { CollectionEntry } from 'astro:content';

/**
 * Generate the proper URL for a blog post based on its type and date
 */
export function getContentUrl(post: CollectionEntry<'blog'>): string {
  const date = new Date(post.data.pubDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const slug = post.id;
  
  const type = post.data.type || 'post';
  
  switch(type) {
    case 'post':
      return `/blog/${year}/${month}/${day}/${slug}`;
    case 'link':
      return `/links/${year}/${month}/${day}/${slug}`;
    case 'note':
      return `/notes/${year}/${month}/${day}/${slug}`;
    case 'quote':
      return `/quotes/${slug}`;
    default:
      return `/blog/${year}/${month}/${day}/${slug}`;
  }
}

/**
 * Extract year, month, day from a slug path
 */
export function parseDateFromSlug(slug: string): { year: string; month: string; day: string; slug: string } | null {
  const match = slug.match(/^(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/);
  if (!match) return null;
  
  return {
    year: match[1],
    month: match[2],
    day: match[3],
    slug: match[4]
  };
}
