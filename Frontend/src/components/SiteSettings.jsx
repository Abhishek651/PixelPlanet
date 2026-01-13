import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Loader, CheckCircle, XCircle, Trash2, Send } from 'lucide-react';

function SiteSettings() {
  const [apiKeys, setApiKeys] = useState({
    openrouter: '',
    gemini: '',
    openai: ''
  });
  const [defaultApiProvider, setDefaultApiProvider] = useState('openrouter');
  const [isLoading, setIsLoading] = useState(false); // For saving/deleting
  const [isFetching, setIsFetching] = useState(true); // For initial load
  const [isTesting, setIsTesting] = useState({ openrouter: false, gemini: false, openai: false });
  const [testResult, setTestResult] = useState({ openrouter: null, gemini: null, openai: null });

  // Demo AI Playground state
  const [prompt, setPrompt] = useState('');
  const [selectedApi, setSelectedApi] = useState('openai');
  const [demoResponse, setDemoResponse] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);


  const fetchSettings = useCallback(async () => {
    console.log("🚀 [FETCH] Starting to fetch settings...");
    setIsFetching(true);
    try {
      const docRef = doc(db, 'settings', 'site');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const settings = docSnap.data();
        console.log("✅ [FETCH] Document data found:", settings);
        const newApiKeys = {
          openrouter: settings.openRouterApiKey || '',
          gemini: settings.geminiApiKey || '',
          openai: settings.openaiApiKey || ''
        };
        setApiKeys(newApiKeys);
        setDefaultApiProvider(settings.defaultApiProvider || 'openrouter');
        console.log("🔄 [STATE] API keys state set to:", newApiKeys);
      } else {
        console.warn("📝 [FETCH] No settings document found. A new one will be created on save.");
      }
    } catch (error) {
      console.error("❌ [FETCH] Error fetching settings:", error);
      alert("Could not fetch site settings. Check the console for errors.");
    } finally {
      setIsFetching(false);
      console.log("🏁 [FETCH] Finished fetching settings.");
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setTestResult({ openrouter: null, gemini: null, openai: null });
    
    const keysToSave = {
      openRouterApiKey: apiKeys.openrouter,
      geminiApiKey: apiKeys.gemini,
      openaiApiKey: apiKeys.openai,
      defaultApiProvider: defaultApiProvider
    };
    console.log("💾 [SAVE] Attempting to save API keys:", keysToSave);

    try {
      const docRef = doc(db, 'settings', 'site');
      await setDoc(docRef, keysToSave, { merge: true });
      console.log("✅ [SAVE] Settings saved successfully!");
      alert('Settings saved!');
    } catch (error) {
      console.error("❌ [SAVE] Error saving settings:", error);
      alert('Failed to save settings. Check the console for errors.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteKey = async (apiType) => {
    if (!window.confirm(`Are you sure you want to delete the ${apiType} API key? This action cannot be undone.`)) {
      return;
    }
    
    setIsLoading(true);
    setApiKeys(prev => ({ ...prev, [apiType]: '' }));
    
    const fieldMapping = {
      openrouter: 'openRouterApiKey',
      gemini: 'geminiApiKey',
      openai: 'openaiApiKey'
    };
    const fieldToDelete = fieldMapping[apiType];
    console.log(`🗑️ [DELETE] Attempting to delete field: ${fieldToDelete}`);

    try {
      const docRef = doc(db, 'settings', 'site');
      await updateDoc(docRef, {
        [fieldToDelete]: deleteField()
      });
      console.log(`✅ [DELETE] Field ${fieldToDelete} deleted successfully.`);
      alert(`${apiType} API key deleted successfully.`);
    } catch (error) {
      console.error(`❌ [DELETE] Error deleting ${apiType} key:`, error);
      alert(`Failed to delete ${apiType} key. Check the console for errors.`);
      // Re-fetch to revert optimistic update on failure
      console.log("🔄 [DELETE] Re-fetching settings after deletion error.");
      fetchSettings();
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestApiKey = async (apiKey, apiType) => {
    if (!apiKey) {
      alert(`Please enter a ${apiType} API key to test.`);
      return;
    }
    setIsTesting(prev => ({ ...prev, [apiType]: true }));
    setTestResult(prev => ({ ...prev, [apiType]: null }));

    let url, body, headers;

    switch (apiType) {
      case 'openrouter':
        url = "https://openrouter.ai/api/v1/chat/completions";
        headers = {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        };
        body = JSON.stringify({
          "model": "openai/gpt-3.5-turbo",
          "messages": [{ "role": "user", "content": "Test prompt" }]
        });
        break;
      case 'gemini':
        url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        headers = {
          "Content-Type": "application/json"
        };
        body = JSON.stringify({
          "contents": [{ "parts": [{ "text": "Test prompt" }] }]
        });
        break;
      case 'openai':
        url = "https://api.openai.com/v1/chat/completions";
        headers = {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        };
        body = JSON.stringify({
          "model": "gpt-3.5-turbo",
          "messages": [{ "role": "user", "content": "Test prompt" }]
        });
        break;
      default:
        setIsTesting(prev => ({ ...prev, [apiType]: false }));
        return;
    }

    try {
      const response = await fetch(url, { method: "POST", headers, body });

      if (response.ok) {
        setTestResult(prev => ({ ...prev, [apiType]: 'success' }));
        
        // Automatically save the key on successful test
        const fieldMapping = {
            openrouter: 'openRouterApiKey',
            gemini: 'geminiApiKey',
            openai: 'openaiApiKey'
        };
        const fieldToSave = fieldMapping[apiType];
        
        try {
            const docRef = doc(db, 'settings', 'site');
            await setDoc(docRef, { [fieldToSave]: apiKey }, { merge: true });
            console.log(`✅ [TEST & SAVE] Key for ${apiType} was valid and has been saved.`);
        } catch (error) {
            console.error(`❌ [TEST & SAVE] Error saving key for ${apiType} after successful test:`, error);
            alert(`API key for ${apiType} is valid, but failed to save automatically. Please try saving manually.`);
        }

      } else {
        const errorData = await response.json();
        console.error(`API Test Error (${apiType}):`, errorData);
        setTestResult(prev => ({ ...prev, [apiType]: 'error' }));
      }
    } catch (error) {
      console.error(`Failed to send request to ${apiType}:`, error);
      setTestResult(prev => ({ ...prev, [apiType]: 'error' }));
    } finally {
      setIsTesting(prev => ({ ...prev, [apiType]: false }));
    }
  };

  const handleDemoSubmit = async () => {
    const apiKey = apiKeys[selectedApi];
    if (!apiKey) {
      alert(`Please save a valid API key for ${selectedApi} before testing.`);
      return;
    }
    if (!prompt.trim()) {
      alert('Please enter a prompt.');
      return;
    }

    setIsDemoLoading(true);
    setDemoResponse('');

    let url, body, headers;

    switch (selectedApi) {
      case 'openrouter':
        url = "https://openrouter.ai/api/v1/chat/completions";
        headers = { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" };
        body = JSON.stringify({ model: "openai/gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] });
        break;
      case 'gemini':
        url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        headers = { "Content-Type": "application/json" };
        body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
        break;
      case 'openai':
        url = "https://api.openai.com/v1/chat/completions";
        headers = { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" };
        body = JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }] });
        break;
      default:
        setIsDemoLoading(false);
        return;
    }

    try {
      const response = await fetch(url, { method: "POST", headers, body });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'An unknown error occurred.');
      }

      let message = '';
      switch (selectedApi) {
        case 'openrouter':
        case 'openai':
          message = data.choices[0].message.content;
          break;
        case 'gemini':
          message = data.candidates[0].content.parts[0].text;
          break;
        default:
          message = 'Could not parse response.';
      }
      setDemoResponse(message);

    } catch (error) {
      console.error(`Demo Error (${selectedApi}):`, error);
      setDemoResponse(`Error: ${error.message}`);
    } finally {
      setIsDemoLoading(false);
    }
  };


  const renderApiKeyInput = (key, name, apiType) => (
    <div>
      <label htmlFor={`${apiType}ApiKey`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {name} API Key
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <input
          type="password"
          id={`${apiType}ApiKey`}
          value={apiKeys[apiType]}
          onChange={(e) => { setApiKeys(prev => ({ ...prev, [apiType]: e.target.value })); setTestResult(prev => ({ ...prev, [apiType]: null })); }}
          className="flex-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-none rounded-l-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:text-white"
          placeholder={`Enter your ${name} API key`}
          disabled={isFetching}
        />
        <button
          onClick={() => handleTestApiKey(apiKeys[apiType], apiType)}
          disabled={isTesting[apiType] || !apiKeys[apiType] || isFetching}
          className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200 dark:disabled:bg-gray-800"
        >
          {isTesting[apiType] ? <Loader className="animate-spin h-5 w-5" /> : 'Test'}
        </button>
        <button
          onClick={() => handleDeleteKey(apiType)}
          disabled={!apiKeys[apiType] || isFetching || isLoading}
          className="inline-flex items-center px-3 py-2 border border-l-0 border-red-500 rounded-r-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 focus:z-10 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 disabled:bg-red-300 dark:disabled:bg-red-800"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
      {testResult[apiType] === 'success' && (
        <div className="mt-2 flex items-center text-green-600 dark:text-green-400">
          <CheckCircle className="h-5 w-5 mr-2" />
          <span>API key is valid and working.</span>
        </div>
      )}
      {testResult[apiType] === 'error' && (
        <div className="mt-2 flex items-center text-red-600 dark:text-red-400">
          <XCircle className="h-5 w-5 mr-2" />
          <span>API key is invalid or failed to connect. Check console for details.</span>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Site Settings</h2>
        <div className="space-y-6">
          <div>
            <label htmlFor="defaultApiProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Default Quiz Generation API
            </label>
            <select
              id="defaultApiProvider"
              value={defaultApiProvider}
              onChange={(e) => setDefaultApiProvider(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isFetching}
            >
              <option value="openrouter">OpenRouter</option>
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
            </select>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The selected API will be used by default for generating quizzes. If it fails, the system will try other available APIs.
            </p>
          </div>

          <hr className="dark:border-gray-600"/>

          {renderApiKeyInput(apiKeys.openrouter, 'OpenRouter', 'openrouter')}
          {renderApiKeyInput(apiKeys.gemini, 'Gemini', 'gemini')}
          {renderApiKeyInput(apiKeys.openai, 'OpenAI', 'openai')}

          <div className="flex justify-end">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading || Object.values(isTesting).some(Boolean)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md dark:bg-gray-800">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">AI Playground</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="apiProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select AI Provider
            </label>
            <select
              id="apiProvider"
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={!Object.values(apiKeys).some(k => k)}
            >
              {apiKeys.openai && <option value="openai">OpenAI</option>}
              {apiKeys.gemini && <option value="gemini">Gemini</option>}
              {apiKeys.openrouter && <option value="openrouter">OpenRouter</option>}
            </select>
          </div>
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter your prompt
            </label>
            <textarea
              id="prompt"
              rows="4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="mt-1 block w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="e.g., Explain quantum computing in simple terms"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleDemoSubmit}
              disabled={isDemoLoading || !apiKeys[selectedApi]}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              {isDemoLoading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <Send className="h-5 w-5 mr-2" />}
              {isDemoLoading ? 'Sending...' : 'Send Prompt'}
            </button>
          </div>
          {demoResponse && (
            <div>
              <h3 className="text-lg font-semibold dark:text-white">Response:</h3>
              <div className="mt-2 p-4 bg-gray-100 dark:bg-gray-900 rounded-md">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">{demoResponse}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SiteSettings;
