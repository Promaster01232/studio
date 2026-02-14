import { EventEmitter } from 'events';

// Since this is a client-side module that might be imported in different components,
// we ensure that we're always using the same EventEmitter instance.
// We attach it to the global window object in development to prevent it from being
// re-initialized on hot reloads.
declare global {
  // eslint-disable-next-line no-var
  var __errorEmitter: EventEmitter | undefined;
}

let errorEmitter: EventEmitter;

if (process.env.NODE_ENV === 'development') {
  if (!global.__errorEmitter) {
    global.__errorEmitter = new EventEmitter();
  }
  errorEmitter = global.__errorEmitter;
} else {
  errorEmitter = new EventEmitter();
}

export { errorEmitter };
