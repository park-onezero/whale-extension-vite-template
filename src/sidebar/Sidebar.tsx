import { useState, useEffect } from 'react';

function Sidebar() {
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    // Get current tab URL when sidebar opens
    whale.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
      }
    });

    // Listen for tab updates
    whale.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.url) {
        setCurrentUrl(changeInfo.url);
      }
    });
  }, []);

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Whale Sidebar
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Current Page</h2>
          <div className="bg-gray-100 p-3 rounded text-sm break-all">
            {currentUrl || 'No active tab'}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-700">Quick Actions</h2>
          <div className="space-y-2">
            <button
              onClick={() => window.open('https://www.whale.naver.com', '_blank', 'whale-space')}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Open in Dual Tab
            </button>
            <button
              onClick={() => whale.sidebarAction.hide()}
              className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Close Sidebar
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by Naver Whale Browser</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
