import { initializeApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

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

let db: Database;

// Initialize Firebase
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);

  // Log successful initialization
  console.log('Firebase initialized successfully with config:', {
    projectId: firebaseConfig.projectId,
    databaseURL: firebaseConfig.databaseURL
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { db }; 