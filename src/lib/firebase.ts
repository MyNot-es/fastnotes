import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getDatabase, Database, ref, onValue } from 'firebase/database';

// Type declaration for the injected configuration
declare const __FIREBASE_CONFIG__: {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

// Log environment variables availability and mode
console.log('Environment status:', {
  mode: import.meta.env.MODE,
  isProd: import.meta.env.PROD,
  baseUrl: import.meta.env.BASE_URL
});

// Use the injected configuration
const firebaseConfig = __FIREBASE_CONFIG__;

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
  // Validate database URL format
  if (!firebaseConfig.databaseURL.startsWith('https://') || !firebaseConfig.databaseURL.includes('firebaseio.com')) {
    throw new Error(`Invalid Firebase Database URL format: ${firebaseConfig.databaseURL}`);
  }

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