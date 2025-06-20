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
  console.log('Initializing Firebase with config:', {
    projectId: firebaseConfig.projectId,
    databaseURL: firebaseConfig.databaseURL,
    authDomain: firebaseConfig.authDomain
  });

  app = initializeApp(firebaseConfig);
  console.log('Firebase App initialized successfully:', {
    name: app.name,
    options: app.options
  });

  db = getDatabase(app);
  console.log('Firebase Realtime Database initialized:', {
    type: db.type,
    app: db.app.name
  });

  // Test database connection
  const dbRef = ref(db, '.info/connected');
  onValue(dbRef, (snapshot) => {
    const connected = snapshot.val();
    console.log('Firebase Database connection state:', connected ? 'CONNECTED' : 'DISCONNECTED');
  }, (error) => {
    console.error('Firebase Database connection error:', error);
  });

} catch (error) {
  console.error('Critical error initializing Firebase:', error);
  throw new Error(`Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

export { db }; 