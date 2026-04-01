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
  firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
    // Enable auto-detection of long-polling to handle restricted network environments
    // and prevent "Could not reach Cloud Firestore backend" errors.
    experimentalAutoDetectLongPolling: true,
  });
} catch (error) {
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
