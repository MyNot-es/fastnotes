import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getDatabase, Database, ref, onValue } from 'firebase/database';

// Type for environment variables to ensure all required fields are present
interface FirebaseEnvVars {
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_DB_URL: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
}

// Validate that all required environment variables are present
const requiredEnvVars: (keyof FirebaseEnvVars)[] = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DB_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

// Log environment variables availability and mode
console.log('Environment status:', {
  mode: import.meta.env.MODE,
  isProd: import.meta.env.PROD,
  baseUrl: import.meta.env.BASE_URL,
  vars: requiredEnvVars.reduce((acc, key) => ({
    ...acc,
    [key]: !!import.meta.env[key]
  }), {})
});

// Get Firebase configuration from Vite's define
declare const __FIREBASE_CONFIG__: {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

// Use the configuration from Vite's define
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