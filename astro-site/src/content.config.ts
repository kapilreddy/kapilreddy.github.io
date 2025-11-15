import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
			draft: z.boolean().optional().default(false),
			tags: z.array(z.string()).optional().default([]),
			categories: z.array(z.string()).optional().default([]),
			// Content type fields for linkblog/notes/quotes
			type: z.enum(['post', 'link', 'note', 'quote']).default('post'),
			link_url: z.string().url().optional(),
			link_source: z.string().optional(), // e.g., "via Hacker News"
			time: z.string().optional(), // e.g., "3:04 pm"
		}),
});

export const collections = { blog };
