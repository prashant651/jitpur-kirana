// Production Firebase Configuration for Jitpur Kirana
const defaultFirebaseConfig = {
  apiKey: "AIzaSyAOupIUwxUzFwNqw13Z9BFyxVcY4hNMN0M",
  authDomain: "jitpur-kirana.firebaseapp.com",
  projectId: "jitpur-kirana",
  storageBucket: "jitpur-kirana.firebasestorage.app",
  messagingSenderId: "251019036622",
  appId: "1:251019036622:web:b393b72a1b836f7e130d9f",
  measurementId: "G-2EQDBZ9X11"
};

let db = null;
let isInitialized = false;
let lastSyncError = null;

export const getSyncError = () => lastSyncError;

export const initFirebase = (config = null) => {
    const finalConfig = config || defaultFirebaseConfig;
    
    if (isInitialized && !config) return db;
    
    try {
        if (typeof firebase !== 'undefined') {
            if (!firebase.apps.length) {
                firebase.initializeApp(finalConfig);
            }
            db = firebase.firestore();
            isInitialized = true;
            console.log("Cloud Sync Active: jitpur-kirana");
            return db;
        }
    } catch (error) {
        console.error("Firebase Sync initialization failed:", error);
        lastSyncError = error.message;
    }
    return null;
};

export const getFirebaseDB = () => {
    if (!db) {
        const savedConfig = localStorage.getItem('jitpur_kirana_firebase_config');
        return initFirebase(savedConfig ? JSON.parse(savedConfig) : defaultFirebaseConfig);
    }
    return db;
};

export const syncToCloud = async (collectionName, data) => {
    const firestore = getFirebaseDB();
    if (!firestore) return;

    try {
        await firestore.collection('app_data').doc(collectionName).set({ 
            content: JSON.stringify(data),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        lastSyncError = null; // Clear error on success
    } catch (error) {
        lastSyncError = error.message;
        console.error(`Cloud Sync Error (${collectionName}):`, error);
    }
};

export const subscribeToCloud = (collectionName, callback) => {
    const firestore = getFirebaseDB();
    if (!firestore) return () => {};

    return firestore.collection('app_data').doc(collectionName).onSnapshot((doc) => {
        if (doc.exists) {
            try {
                const data = JSON.parse(doc.data().content);
                callback(data);
                lastSyncError = null;
            } catch (e) {
                console.error("Cloud Data Parse Error:", e);
            }
        }
    }, (error) => {
        lastSyncError = error.message;
        console.error(`Cloud Subscription Error (${collectionName}):`, error);
    });
};