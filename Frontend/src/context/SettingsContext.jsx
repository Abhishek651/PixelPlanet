import React, { createContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const SettingsContext = createContext();



export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({ openRouterApiKey: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, 'settings', 'site');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data());
                }
            } catch (error) {
                // Silently fail if settings can't be read (e.g., not logged in or no permissions)
                console.log('Settings not available:', error.message);
            }
        };
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};
