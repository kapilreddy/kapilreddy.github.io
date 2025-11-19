// Get current tab information when popup opens
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Pre-fill URL and title
    document.getElementById('url').value = tab.url;
    document.getElementById('title').value = tab.title;
    
  } catch (error) {
    showStatus('Error loading tab information', 'error');
  }
});

// Handle settings link click
document.getElementById('settingsLink').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Handle form submission
document.getElementById('linkForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const formData = {
      title: document.getElementById('title').value,
      url: document.getElementById('url').value,
      source: document.getElementById('source').value,
      tags: document.getElementById('tags').value,
      description: document.getElementById('description').value,
      content: document.getElementById('content').value,
      draft: document.getElementById('draft').checked
    };
    
    // Generate markdown content
    const markdown = generateMarkdown(formData);
    
    // Create filename from title (slug format)
    const filename = createSlug(formData.title) + '.md';
    
    // Get settings from storage
    const settings = await chrome.storage.sync.get({
      defaultPath: '',
      autoSave: false
    });
    
    // Build full path with default location if set
    const fullPath = settings.defaultPath 
      ? settings.defaultPath + filename 
      : filename;
    
    // Download the file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    await chrome.downloads.download({
      url: url,
      filename: fullPath,
      saveAs: !settings.autoSave  // Skip "Save As" if autoSave is enabled
    });
    
    showStatus('Markdown file saved successfully!', 'success');
    
    // Clear form after a delay
    setTimeout(() => {
      window.close();
    }, 1500);
    
  } catch (error) {
    showStatus('Error saving file: ' + error.message, 'error');
  }
});

function generateMarkdown(data) {
  const now = new Date();
  const pubDate = formatDate(now);
  const time = formatTime(now);
  
  // Parse tags into array format
  const tags = data.tags
    ? data.tags.split(',').map(tag => `"${tag.trim()}"`).join(', ')
    : '';
  
  // Build frontmatter
  let frontmatter = `---
title: "${escapeQuotes(data.title)}"
pubDate: ${pubDate}
time: "${time}"
type: "link"
link_url: "${data.url}"`;
  
  if (data.source) {
    frontmatter += `\nlink_source: "${escapeQuotes(data.source)}"`;
  }
  
  if (tags) {
    frontmatter += `\ntags: [${tags}]`;
  }
  
  frontmatter += `\ndescription: "${escapeQuotes(data.description)}"`;
  
  if (data.draft) {
    frontmatter += `\ndraft: true`;
  }
  
  frontmatter += '\n---\n';
  
  // Add content/commentary if provided
  const content = data.content ? '\n' + data.content + '\n' : '';
  
  return frontmatter + content;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(date) {
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

function escapeQuotes(text) {
  return text.replace(/"/g, '\\"');
}

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  
  if (type === 'error') {
    setTimeout(() => {
      statusEl.className = 'status';
    }, 5000);
  }
}
