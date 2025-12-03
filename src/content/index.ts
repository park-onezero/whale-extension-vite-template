// Content script - runs in the context of web pages

console.log('Content script loaded');

// Example: Send message to background script
whale.runtime.sendMessage({ type: 'GET_DATA' }, (response) => {
  console.log('Response from background:', response);
});

// Example: Listen for messages from popup or background
whale.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in content script:', request);

  if (request.type === 'PING') {
    sendResponse({ message: 'PONG' });
  }

  return true;
});

// Example: Modify the page
function modifyPage() {
  // Add your page modification logic here
  console.log('Page URL:', window.location.href);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', modifyPage);
} else {
  modifyPage();
}
