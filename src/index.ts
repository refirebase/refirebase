import type { FirebaseApp } from "firebase/app";

import { init } from "./firebase";

import { FirebaseAnalytics } from "./firebase/analytics";
import { FirestoreDatabase } from "./firebase/firestore";
import { RealtimeDatabase } from "./firebase/realtime";
import { StorageFirebase } from "./firebase/storage";
import { FirebaseAuth } from "./firebase/auth";

import { FirebaseConfig } from "./types/firebase/config";
import { WhereCondition } from "./types/firebase/firestore";

// Adding type declaration for window.__FIREBASE_CONFIG__
declare global {
  interface Window {
    __FIREBASE_CONFIG__?: Record<string, string>;
  }
}

export class Refirebase {
  private readonly internalConfig: FirebaseConfig;
  private readonly app: FirebaseApp;

  public readonly db: {
    firestore: FirestoreDatabase;
    realtime: RealtimeDatabase;
    storage: StorageFirebase;
  };

  public readonly auth: FirebaseAuth;
  public readonly analytics: FirebaseAnalytics;

  constructor(firebaseConfig?: Partial<FirebaseConfig>) {
    /**
     * Get environment variable
     *
     * @param key - The environment variable key
     * @returns The environment variable value or undefined if not found
     */
    const getEnv = (key: string): string | undefined => {
      // In Node.js, try to use process.env
      if (typeof process !== "undefined" && process.env) {
        return process.env[key];
      }

      // In browser, try to use window.__FIREBASE_CONFIG__
      if (typeof window !== "undefined" && window.__FIREBASE_CONFIG__) {
        return window.__FIREBASE_CONFIG__[key];
      }
      return undefined;
    };

    /**
     * Try to get values from environment variables first
     */
    const envConfig: Partial<FirebaseConfig> = {
      apiKey: getEnv("FIREBASE_API_KEY"),
      authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
      databaseURL: getEnv("FIREBASE_DATABASE_URL"),
      projectId: getEnv("FIREBASE_PROJECT_ID"),
      storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
      messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
      appId: getEnv("FIREBASE_APP_ID"),
      measurementId: getEnv("FIREBASE_MEASUREMENT_ID"),
    };

    /**
     * Merge environment variables with provided config, preferring provided config values
     */
    const config = {
      ...envConfig,
      ...firebaseConfig,
    };

    /**
     * Check for required values
     * If any of the required values are missing, throw an error
     */
    if (
      !config.apiKey ||
      !config.authDomain ||
      !config.projectId ||
      !config.storageBucket ||
      !config.messagingSenderId ||
      !config.appId
    ) {
      const missingValues = Object.keys(config).filter(
        (key) => !config[key as keyof FirebaseConfig]
      );

      throw new Error(
        `Missing Firebase keys: ${missingValues.join(
          ", "
        )}. Please provide all required keys either through environment variables or the config object.`
      );
    }

    this.internalConfig = config as FirebaseConfig;
    this.app = init(this.internalConfig);

    this.db = {
      firestore: new FirestoreDatabase(this.app),
      realtime: new RealtimeDatabase(this.app),
      storage: new StorageFirebase(this.app),
    };

    this.auth = new FirebaseAuth(this.app);
    this.analytics = new FirebaseAnalytics(this.app);
  }
}

export type {
  FirebaseConfig as RefirebaseConfig,
  FirebaseApp as RefirebaseApp,
  FirestoreDatabase as RefirebaseFirestore,
  RealtimeDatabase as RefirebaseRealtime,
  StorageFirebase as RefirebaseStorage,
  FirebaseAuth as RefirebaseAuth,
  FirebaseAnalytics as RefirebaseAnalytics,
  WhereCondition as RefirebaseWhereCondition,
};
