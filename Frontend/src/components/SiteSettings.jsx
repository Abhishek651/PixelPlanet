import React, { useState } from 'react';

function SiteSettings() {
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    console.log('Saving settings:', { openRouterApiKey });
    alert('Settings saved!');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Site Settings</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="openRouterApiKey" className="block text-sm font-medium text-gray-700">
            OpenRouter API Key
          </label>
          <input
            type="text"
            id="openRouterApiKey"
            value={openRouterApiKey}
            onChange={(e) => setOpenRouterApiKey(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter your OpenRouter API key"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default SiteSettings;
