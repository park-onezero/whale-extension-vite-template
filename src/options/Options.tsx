import { useState, useEffect } from 'react';

function Options() {
  const [settings, setSettings] = useState({
    option1: true,
    option2: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved settings
    whale.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings as typeof settings);
      }
    });
  }, []);

  const handleSave = () => {
    whale.storage.sync.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Extension Options</h1>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label htmlFor="option1" className="text-sm font-medium">
              Enable Option 1
            </label>
            <input
              id="option1"
              type="checkbox"
              checked={settings.option1}
              onChange={(e) => setSettings({ ...settings, option1: e.target.checked })}
              className="w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="option2" className="text-sm font-medium">
              Enable Option 2
            </label>
            <input
              id="option2"
              type="checkbox"
              checked={settings.option2}
              onChange={(e) => setSettings({ ...settings, option2: e.target.checked })}
              className="w-4 h-4"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Save Settings
        </button>

        {saved && (
          <span className="ml-4 text-green-600 text-sm">Settings saved!</span>
        )}
      </div>
    </div>
  );
}

export default Options;
