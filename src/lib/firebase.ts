import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getDatabase, Database, ref, onValue } from 'firebase/database';

// Log environment variables availability and mode
console.log('Environment status:', {
  mode: import.meta.env.MODE,
  isProd: import.meta.env.PROD,
  baseUrl: import.meta.env.BASE_URL
});

// Firebase configuration using environment variables directly
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_REALTIME_DB_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Log the actual configuration being used (without sensitive values)
console.log('Firebase configuration:', {
  authDomain: firebaseConfig.authDomain,
  databaseURL: firebaseConfig.databaseURL,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket
});

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
      console.warn('Firebase Database disconnected. Current configuration:', {
        databaseURL: firebaseConfig.databaseURL,
        projectId: firebaseConfig.projectId
      });
    } else {
      console.log('Firebase Database connected successfully');
    }
  });

} catch (error) {
  console.error('Failed to initialize Firebase:', error instanceof Error ? error.message : 'Unknown error');
  console.error('Configuration used:', {
    authDomain: firebaseConfig.authDomain,
    databaseURL: firebaseConfig.databaseURL,
    projectId: firebaseConfig.projectId
  });
  throw error;
}

export { db }; 