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
  /**
   * INSTITUTIONAL CONNECTIVITY HARDENING:
   * 
   * Force Long-Polling to overcome restrictive cloud network environments (proxies/firewalls)
   * and resolve the "@firebase/firestore: Could not reach Cloud Firestore backend" timeout error.
   * 
   * experimentalForceLongPolling: true ensures definitive ingress by avoiding streaming nodes.
   */
  firestore = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager(),
    }),
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: false,
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
