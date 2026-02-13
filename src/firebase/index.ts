// This file now acts as a simple barrel file, re-exporting the necessary providers and hooks.
// The actual initialization logic is now fully contained within FirebaseClientProvider.

import { FirebaseProvider, useFirebase, useFirebaseApp, useFirestore, useAuth } from './provider';
import { FirebaseClientProvider } from './client-provider';

// The initializeFirebase function is no longer needed here since the client provider handles it.

export {
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebase,
  useFirebaseApp,
  useFirestore,
  useAuth,
};
