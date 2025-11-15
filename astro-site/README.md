# Hugo to Astro.js Migration

This is a migrated version of your Hugo site to Astro.js, maintaining the same design and functionality.

## What Was Migrated

### ✅ Content
- **7 blog posts** migrated from Hugo's TOML/YAML format to Astro-compatible frontmatter
- **About page** recreated with your bio and presentation links
- **All static assets** (images, Three.js scripts) copied to `public/` directory

### ✅ Features Preserved
- **Three.js animated landing page** with scroll-snap sections (About, Skills, Projects, Interests)
- **Blog functionality** with tags, categories, and draft status
- **RSS feed** generation
- **Responsive design** with mobile breakpoints
- **Dark theme** styling
- **Social media links** (GitHub, Twitter/X)

### ✅ Technical Setup
- **Content Collections** configured for type-safe blog posts
- **GitHub Pages deployment** workflow ready
- **Sitemap** generation
- **Static site generation (SSG)**

## Project Structure

```
astro-site/
├── public/              # Static assets
│   ├── images/         # Profile picture, logos
│   └── js/             # Three.js particle animation
├── src/
│   ├── components/     # Reusable Astro components
│   ├── content/
│   │   └── blog/       # Blog posts (markdown/MDX)
│   ├── layouts/        # Page layouts
│   ├── pages/          # Routes
│   │   ├── index.astro      # Landing page with Three.js
│   │   ├── about.astro      # About page
│   │   └── blog/            # Blog listing & posts
│   └── styles/         # Global styles
├── astro.config.mjs    # Astro configuration
└── package.json        # Dependencies
```

## Getting Started

### Development Server

```bash
cd astro-site
yarn install  # or npm install
yarn dev      # Start dev server at http://localhost:4321
```

### Production Build

```bash
yarn build    # Build static site to dist/
yarn preview  # Preview production build
```

## Deployment

### Option 1: GitHub Pages (Recommended)

The `.github/workflows/deploy.yml` workflow is already configured.

**Steps:**
1. Push the `astro-site` directory to your GitHub repository
2. Go to **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: **GitHub Actions**
4. Push to the `main` branch to trigger deployment

Your site will be live at `https://kapilreddy.github.io`

### Option 2: Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Build settings:
   - **Build command:** `yarn build`
   - **Build output directory:** `dist`
   - **Root directory:** `astro-site`

## Key Differences from Hugo

### Content Format
**Hugo (TOML):**
```toml
+++
title = "Post Title"
draft = true
tags = ["tag1"]
+++
```

**Astro (YAML):**
```yaml
---
title: "Post Title"
draft: true
tags: ["tag1"]
pubDate: 2024-01-01
---
```

### Directory Changes
- `content/posts/` → `src/content/blog/`
- `static/` → `public/`
- `themes/` → Built-in Astro components

### Build Output
- Hugo: `public/`
- Astro: `dist/`

## Features

### Landing Page
- **Four scroll-snap sections**: About, Skills, Projects, Interests
- **Three.js particle animation** with smooth transitions
- **Navigation dots** for quick section switching
- **Responsive design** optimized for mobile/tablet

### Blog
- **Content Collections** with type safety
- **Tags and categories** support
- **Draft posts** filtered from production
- **RSS feed** at `/rss.xml`
- **Sitemap** for SEO

### Performance
- **Static Site Generation (SSG)**
- **Automatic image optimization** (Sharp)
- **Sitemap and RSS** generation
- **Fast page loads** with Astro's island architecture

## Configuration

### Site Metadata
Edit `src/consts.ts`:
```ts
export const SITE_TITLE = 'Mugencode';
export const SITE_DESCRIPTION = 'Builder of things & teller of stories';
```

### Deployment URL
Edit `astro.config.mjs`:
```js
export default defineConfig({
  site: 'https://kapilreddy.github.io',
  // ...
});
```

## Adding New Content

### Create a New Blog Post

```bash
# Create file: src/content/blog/my-new-post.md
```

```yaml
---
title: "My New Post"
pubDate: 2024-01-15
description: "Post description"
tags: ["clojure", "tech"]
categories: ["technical"]
draft: false
---

Your content here...
```

### Modify Landing Page

Edit `src/pages/index.astro` to update:
- About section
- Skills list
- Projects
- Interests/hobbies

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist .astro
yarn install
yarn build
```

### Three.js Not Loading
Ensure scripts have `is:inline` directive:
```html
<script is:inline src="/js/three.js"></script>
```

## Next Steps

1. **Test locally**: Run `yarn dev` and verify all pages work
2. **Review content**: Check that all blog posts migrated correctly
3. **Deploy**: Push to GitHub and enable GitHub Pages
4. **Custom domain** (optional): Add CNAME file to `public/`

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [GitHub Pages Deployment](https://docs.astro.build/en/guides/deploy/github/)
- [Cloudflare Pages Deployment](https://docs.astro.build/en/guides/deploy/cloudflare/)

## Support

For issues or questions about the migration:
- Check the [Astro Discord](https://astro.build/chat)
- Review [Astro GitHub Discussions](https://github.com/withastro/astro/discussions)
