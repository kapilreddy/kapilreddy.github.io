// Load saved settings when page opens
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const settings = await chrome.storage.sync.get({
      defaultPath: '',
      autoSave: false
    });
    
    document.getElementById('defaultPath').value = settings.defaultPath;
    document.getElementById('autoSave').checked = settings.autoSave;
    
  } catch (error) {
    showStatus('Error loading settings', 'error');
  }
});

// Handle form submission
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  try {
    const settings = {
      defaultPath: document.getElementById('defaultPath').value.trim(),
      autoSave: document.getElementById('autoSave').checked
    };
    
    // Save to Chrome storage
    await chrome.storage.sync.set(settings);
    
    showStatus('Settings saved successfully!', 'success');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      const statusEl = document.getElementById('status');
      statusEl.className = 'status';
    }, 3000);
    
  } catch (error) {
    showStatus('Error saving settings: ' + error.message, 'error');
  }
});

function showStatus(message, type) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
}
