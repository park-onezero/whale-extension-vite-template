// Background service worker for Whale extension

whale.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');

  // Initialize default settings
  whale.storage.sync.set({
    settings: {
      option1: true,
      option2: false,
    }
  });
});

whale.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);

  // Handle messages from content scripts or popup
  if (request.type === 'GET_DATA') {
    sendResponse({ data: 'Hello from background' });
  }

  return true; // Keep message channel open for async response
});

// Example: Listen to tab updates
whale.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    console.log('Tab updated:', tab.url);
  }
});
