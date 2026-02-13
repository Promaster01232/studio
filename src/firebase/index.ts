
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
import { FirebaseClientProvider } from './client-provider';

// Initialize Firebase and its services once at the module level.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Enable persistence on the client, handling potential errors.
if (typeof window !== 'undefined') {
  try {
    enableIndexedDbPersistence(firestore);
  } catch (err: any) {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed, likely due to multiple tabs being open.');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence is not supported in this browser.');
    }
  }
}

// This function now just returns the singleton instances.
function initializeFirebase() {
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
