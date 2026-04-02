
'use client';
import { ReactNode } from 'react';
import { FirebaseProvider } from './provider';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager, 
  type Firestore 
} from 'firebase/firestore';
import { getDatabase, type Database } from 'firebase/database';
import { firebaseConfig } from './config';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  rtdb: Database;
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

let firestore: Firestore;
try {
  // Institutional Hardening: Use explicit initialization with resilient connection protocols
  firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
    // Force auto-detection of long-polling to overcome restrictive firewalls/proxies
    // and prevent "Could not reach Cloud Firestore backend" errors.
    experimentalAutoDetectLongPolling: true,
    // Disabling fetch streams often improves stability in cloud-based dev environments
    experimentalForceLongPolling: false, 
  });
} catch (error) {
  console.warn("[FIREBASE] Re-initializing existing Firestore node.");
  firestore = getFirestore(app);
}

const rtdb = getDatabase(app);
const instances = { app, auth, firestore, rtdb };

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider value={instances}>
      {children}
    </FirebaseProvider>
  );
}
