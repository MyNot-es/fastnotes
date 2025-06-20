import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getDatabase, Database, ref, onValue } from 'firebase/database';

// Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const missingVars = Object.entries(firebaseConfig)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Missing Firebase configuration variables:', missingVars);
  throw new Error(`Missing Firebase configuration: ${missingVars.join(', ')}`);
}

let app: FirebaseApp;
let db: Database;

// Initialize Firebase
try {
  app = initializeApp(firebaseConfig);
  db = getDatabase(app);

  // Monitor database connection status
  const connectedRef = ref(db, '.info/connected');
  onValue(connectedRef, (snapshot) => {
    const connected = snapshot.val();
    if (!connected) {
      console.warn('Firebase Database disconnected. Please check your database URL configuration.');
    }
  });

} catch (error) {
  console.error('Failed to initialize Firebase:', error instanceof Error ? error.message : 'Unknown error');
  throw error;
}

export { db }; 