# Linkblog & Fleeting Thoughts Guide

This blog now supports multiple content types inspired by [Simon Willison's blog](https://simonwillison.net/):

- **Posts** - Full blog articles with hero images
- **Links** - Linkblog entries with external URLs and commentary
- **Notes** - Brief fleeting thoughts and observations
- **Quotes** - Quoted content with attribution

## Content Types

### Full Blog Post (default)

```markdown
---
title: "Your Post Title"
pubDate: 2024-11-15
description: "A description of your post"
heroImage: ./path-to-image.jpg
tags: ["tag1", "tag2"]
categories: ["category"]
# type: "post" is the default, so you can omit it
---

Your full blog content here...
```

### Linkblog Entry

```markdown
---
title: "Interesting Article Title"
pubDate: 2024-11-15
time: "3:04 pm"
type: "link"
link_url: "https://example.com/article"
link_source: "via Hacker News"
tags: ["ai", "tools"]
description: "Brief summary of what this link is about"
---

Your commentary about the link goes here. What's interesting about it? 
Why are you sharing it?
```

### Fleeting Note/Thought

```markdown
---
title: "A quick observation"
pubDate: 2024-11-15
time: "2:30 pm"
type: "note"
tags: ["programming", "thoughts"]
description: "A brief thought or observation"
---

Your fleeting thought or observation. Can be short and informal.
No need for elaborate formatting or structure.
```

### Quote

```markdown
---
title: "The quote itself"
pubDate: 2024-11-14
time: "10:15 am"
type: "quote"
tags: ["wisdom"]
description: "Author Name"
---

Optional additional context or commentary about the quote.
```

## Field Reference

### Common Fields
- `title` (required) - The title/heading
- `pubDate` (required) - Publication date
- `time` (optional) - Specific time like "3:04 pm" (Simon Willison style)
- `type` (optional) - One of: `post` (default), `link`, `note`, `quote`
- `tags` (optional) - Array of tags
- `description` (optional) - Summary or subtitle
- `draft` (optional) - Set to `true` to hide from production

### Post-Specific Fields
- `heroImage` (optional) - Image for full posts
- `updatedDate` (optional) - Last update date
- `categories` (optional) - Categories array

### Link-Specific Fields
- `link_url` (optional) - External URL for linkblog entries
- `link_source` (optional) - Source attribution like "via Hacker News"

## Viewing & Filtering

- **All content**: `/blog`
- **Posts only**: `/blog/posts`
- **Links only**: `/blog/links`
- **Notes only**: `/blog/notes`
- **Quotes only**: `/blog/quotes`

The filter bar shows counts for each type and highlights the active filter.

## Example Entries

Check out these example files to see each type in action:
- Link: `example-link-claude-skills.md`
- Note: `example-note-database-migrations.md`
- Quote: `example-quote-kent-beck.md`

**Note:** All examples have `draft: true` set. Remove this line to publish them!

## Tips

1. **Use timestamps** for that "stream of consciousness" feel (like Simon Willison)
2. **Keep notes brief** - they're meant to be quick thoughts
3. **Links work best** with a short commentary explaining why it's interesting
4. **Mix content types** - the unified stream is the magic
5. **Tags help organization** - they appear on individual entry pages

## Visual Differences

- **Posts**: Large cards with images (if provided), two-column grid
- **Links**: Compact single line, title links to external URL, has permalink (#)
- **Notes**: Simple text blocks, full width
- **Quotes**: Blockquote styling, full width

Happy blogging! 🚀
