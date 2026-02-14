'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Instances are guaranteed to be non-null by FirebaseClientProvider
interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// We provide a dummy default value, but it will be overridden.
const FirebaseContext = createContext<FirebaseContextValue>({} as FirebaseContextValue);

export function FirebaseProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: FirebaseContextValue;
}) {
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

// The hooks will now return non-nullable types, improving type safety.
export const useFirebase = (): FirebaseContextValue => useContext(FirebaseContext);
export const useFirebaseApp = (): FirebaseApp => useContext(FirebaseContext).app;
export const useFirestore = (): Firestore => useContext(FirebaseContext).firestore;
export const useAuth = (): Auth => useContext(FirebaseContext).auth;
