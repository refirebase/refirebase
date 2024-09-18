import { type FirebaseApp, initializeApp } from "firebase/app";
import { FirebaseError } from "firebase/app";

let app: FirebaseApp | null = null;

export function initializeFirebase(config: {
  apiKey: string;
  appId: string;
  authDomain: string;
  databaseURL?: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  measurementId?: string;
}) {
  if (app) return app;

  try {
    app = initializeApp(config);
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(`x Firebase initialization error: ${error.message}`);
    }

    throw new Error(`x Firebase initialization unexpected error: ${error}`);
  }

  return app;
}

export { app };
