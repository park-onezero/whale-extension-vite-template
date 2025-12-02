// Background service worker for Chrome extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');

  // Initialize default settings
  chrome.storage.sync.set({
    settings: {
      option1: true,
      option2: false,
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);

  // Handle messages from content scripts or popup
  if (request.type === 'GET_DATA') {
    sendResponse({ data: 'Hello from background' });
  }

  return true; // Keep message channel open for async response
});

// Example: Listen to tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});
