# Linkblog Capture - Chrome Extension

A Chrome extension to quickly capture links and save them as markdown files for your linkblog.

## Features

- 📝 Captures current tab's URL and title automatically
- 🏷️ Add tags, source attribution, and description
- 💭 Optional commentary section for your thoughts
- 📄 Generates properly formatted markdown files
- 💾 Downloads files with auto-generated slugified filenames
- 📋 Matches your linkblog's frontmatter format exactly

## Installation

### Step 1: Load as Unpacked Extension (Development Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right
3. Click "Load unpacked"
4. Select the `linkblog-extension` directory
5. The extension icon should appear in your browser toolbar

### Step 2: Pin to Toolbar (Recommended)

After loading the extension:
1. Click the puzzle piece icon in Chrome's toolbar
2. Find "Linkblog Capture" in the list
3. Click the pin icon to keep it visible

### Step 3: Configure Default Save Location (Optional)

1. Right-click the extension icon and select "Options"
   - Or click the ⚙️ icon in the popup
2. Set your preferred default path (e.g., "linkblog-files/")
3. Enable "Auto-save" if you want to skip the "Save As" dialog
4. Click "Save Settings"

## Usage

### Capturing a Link

1. **Navigate to a page** you want to save
2. **Click the extension icon** in your toolbar
3. **Fill in the form:**
   - Title (pre-filled with page title)
   - URL (pre-filled, read-only)
   - Source (optional, e.g., "via Hacker News")
   - Tags (comma-separated, e.g., "ai, github, meta")
   - Description (required, brief summary)
   - Commentary (optional, your thoughts)
   - Draft checkbox (if you want to save as draft)
4. **Click "Save Markdown"**
5. File will be saved to your configured location (or you'll be prompted to choose)

### Settings

Access settings by:
- Right-clicking the extension icon → "Options"
- Clicking the ⚙️ icon in the popup

**Available Settings:**

- **Default Save Location**: Specify a relative path within your Downloads folder
  - Example: `linkblog-files/` will save to `Downloads/linkblog-files/`
  - Leave empty to save directly to Downloads
- **Auto-save**: When enabled, files save automatically without prompting for location

## Output Format

The extension generates markdown files with this frontmatter structure:

```markdown
---
title: "Your Title Here"
pubDate: 2024-07-24
time: "1:30 pm"
type: "link"
link_url: "https://example.com"
link_source: "via Source Name"
tags: ["tag1", "tag2", "tag3"]
description: "Brief description of the link"
draft: true
---

Your optional commentary goes here.
```

## File Structure

```
linkblog-extension/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup interface
├── popup.css          # Styling for the popup
├── popup.js           # Main extension logic
├── icon.svg           # Source icon
├── icon16.png         # 16x16 icon
├── icon48.png         # 48x48 icon
├── icon128.png        # 128x128 icon
└── README.md          # This file
```

## Permissions

The extension requires:
- `activeTab`: To read the current tab's URL and title
- `downloads`: To save the generated markdown file
- `storage`: To save your settings preferences

## Customization

### Changing the Icon

Replace the `icon.svg` file and regenerate PNG files:

```bash
magick icon.svg -resize 16x16 icon16.png
magick icon.svg -resize 48x48 icon48.png
magick icon.svg -resize 128x128 icon128.png
```

### Modifying the Markdown Format

Edit the `generateMarkdown()` function in `popup.js` to adjust the frontmatter structure or add new fields.

### Styling Changes

Edit `popup.css` to customize the appearance of the popup form.

## Troubleshooting

**Extension doesn't load:**
- Ensure all files are in the same directory
- Check that manifest.json is valid JSON
- Look for errors in `chrome://extensions/`

**Download doesn't work:**
- Check that the extension has the `downloads` permission
- Ensure your browser allows downloads

**Fields not pre-filling:**
- Make sure the extension has the `activeTab` permission
- Try reloading the extension

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the Linkblog Capture extension
4. Test your changes

## License

This extension is provided as-is for personal use with your linkblog.

## Future Enhancements

Potential improvements:
- Keyboard shortcut to open popup
- Auto-suggest tags based on page content
- Save directly to GitHub repository via API
- Template customization UI
- Multiple markdown format presets
