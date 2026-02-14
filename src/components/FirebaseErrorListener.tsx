'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { useToast } from '@/hooks/use-toast';
import { FirestorePermissionError } from '@/firebase/errors';

// This component listens for global Firestore permission errors
// and throws them to be caught by the Next.js error overlay in development.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // In development, we want to see the rich error overlay.
      // In production, you might want to log this to a monitoring service.
      if (process.env.NODE_ENV === 'development') {
        console.error("A Firestore permission error was caught. This will be thrown to show the Next.js error overlay. See below for details.", error);
        // Throwing the error will trigger the Next.js development error overlay.
        throw error;
      } else {
        // In production, show a generic toast and log the error.
        console.error('Firestore Permission Error:', error);
        toast({
          variant: 'destructive',
          title: 'Permission Denied',
          description: 'You do not have permission to perform this action.',
        });
      }
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything.
}
