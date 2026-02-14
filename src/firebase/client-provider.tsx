'use client';
import { ReactNode, useEffect, useState } from 'react';
import { FirebaseProvider } from './provider';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { Loader2 } from 'lucide-react';

interface FirebaseInstances {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// Create singleton instances at the module level
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const instances = { app, auth, firestore };

export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const [persistenceEnabled, setPersistenceEnabled] = useState(false);

  useEffect(() => {
    enableIndexedDbPersistence(firestore)
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn(
            'Firestore persistence failed, likely due to multiple tabs being open.'
          );
        } else if (err.code === 'unimplemented') {
          console.warn(
            'Firestore persistence is not supported in this browser.'
          );
        }
      })
      .finally(() => {
        setPersistenceEnabled(true);
      });
  }, []);

  // Show a loader until persistence has been configured.
  // This is crucial to prevent Firestore operations before persistence is ready.
  if (!persistenceEnabled) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <FirebaseProvider value={instances}>
      {children}
    </FirebaseProvider>
  );
}
