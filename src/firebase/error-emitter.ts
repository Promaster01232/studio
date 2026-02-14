'use client';

import { EventEmitter } from 'events';

// Since this is a client-side module that might be imported in different components,
// we ensure that we're always using the same EventEmitter instance.
// We attach it to the global window object in development to prevent it from being
// re-initialized on hot reloads.
declare global {
  interface Window {
    __errorEmitter?: EventEmitter;
  }
}

let errorEmitter: EventEmitter;

// This check ensures that the window object is only accessed on the client-side.
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    if (!window.__errorEmitter) {
        window.__errorEmitter = new EventEmitter();
    }
    errorEmitter = window.__errorEmitter;
} else {
    // For server-side rendering or production builds, a new EventEmitter is created.
    // This is safe because on the server, each request is a separate context,
    // and in production client, hot-reloading is not a concern.
    errorEmitter = new EventEmitter();
}

export { errorEmitter };
