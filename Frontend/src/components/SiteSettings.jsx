import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

function SiteSettings() {
  const [openRouterApiKey, setOpenRouterApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'site');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOpenRouterApiKey(docSnap.data().openRouterApiKey);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'settings', 'site');
      await setDoc(docRef, { openRouterApiKey }, { merge: true });
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">Site Settings</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="openRouterApiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            OpenRouter API Key
          </label>
          <input
            type="text"
            id="openRouterApiKey"
            value={openRouterApiKey}
            onChange={(e) => setOpenRouterApiKey(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
            placeholder="Enter your OpenRouter API key"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SiteSettings;
