import { useState, useEffect, useRef } from 'react';
import { syncToCloud, subscribeToCloud, getFirebaseDB } from '../services/firebase.js';

export function usePersistentState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  });

  const isFirstRender = useRef(true);
  const skipNextSync = useRef(false);

  // Initial load from Cloud if available
  useEffect(() => {
    const db = getFirebaseDB();
    if (!db) return;

    console.log(`Setting up cloud listener for ${key}`);
    const unsubscribe = subscribeToCloud(key, (cloudData) => {
        // Compare cloud data with local to prevent infinite loops
        const localData = localStorage.getItem(key);
        if (JSON.stringify(cloudData) !== localData) {
            skipNextSync.current = true;
            setValue(cloudData);
            window.localStorage.setItem(key, JSON.stringify(cloudData));
        }
    });

    return () => unsubscribe();
  }, [key]);

  // Sync to local and cloud on change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    try {
      const stringified = JSON.stringify(value);
      window.localStorage.setItem(key, stringified);
      
      if (!skipNextSync.current) {
          syncToCloud(key, value);
      }
      skipNextSync.current = false;
    } catch (error) {
      console.error(`Error setting localStorage/cloud key “${key}”:`, error);
    }
  }, [key, value]);

  return [value, setValue];
}