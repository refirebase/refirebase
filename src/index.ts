import type { FirebaseApp } from "firebase/app";

import { init } from "./firebase";

import { FirebaseAnalytics } from "./firebase/analytics";
import { FirestoreDatabase } from "./firebase/firestore";
import { RealtimeDatabase } from "./firebase/realtime";
import { StorageFirebase } from "./firebase/storage";
import { FirebaseAuth } from "./firebase/auth";

import { FirebaseConfig } from "./types/firebase/config";
import { WhereCondition } from "./types/firebase/firestore";

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
     * Try to get values from environment variables first
     */
    const envConfig: Partial<FirebaseConfig> = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
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
