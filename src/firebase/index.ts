
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
import { FirebaseClientProvider } from './client-provider';

// This is a flag to ensure persistence is only enabled once.
let persistenceEnabled = false;

function initializeFirebase() {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  // This should only run on the client, and only once.
  if (typeof window !== 'undefined' && !persistenceEnabled) {
    persistenceEnabled = true;
    enableIndexedDbPersistence(firestore).catch((err) => {
        if (err.code == 'failed-precondition') {
            console.warn('Firestore persistence failed, multiple tabs may be open.');
        } else if (err.code == 'unimplemented') {
            console.warn('Firestore persistence is not supported in this browser.');
        }
    });
  }

  return { app, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
