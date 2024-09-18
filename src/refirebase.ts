import { init } from "./firebase";
import type { FirebaseConfig } from "./types/firebase-config";

import { FirestoreDatabase } from "./firebase/firestore";
import { RealtimeDatabase } from "./firebase/realtime";
import { StorageFirebase } from "./firebase/storage";

import { FirebaseAnalytics } from "./firebase/analytics";
import { FirebaseAuth } from "./firebase/auth";

import type { FirebaseApp } from "firebase/app";

export class Refirebase {
  private readonly config: FirebaseConfig;
  private readonly app: FirebaseApp;

  readonly db: {
    firestore: FirestoreDatabase;
    realtime: RealtimeDatabase;
    storage: StorageFirebase;
  };

  readonly auth: FirebaseAuth;
  readonly analytics: FirebaseAnalytics;

  constructor(config: FirebaseConfig) {
    if (
      !config.apiKey ||
      !config.authDomain ||
      !config.projectId ||
      !config.storageBucket ||
      !config.messagingSenderId ||
      !config.appId
    ) {
      throw new Error(
        "Missing Firebase configuration keys. Please provide all required keys."
      );
    }

    this.config = config;

    this.app = init(this.config);

    this.db = {
      firestore: new FirestoreDatabase(this.app),
      realtime: new RealtimeDatabase(this.app),
      storage: new StorageFirebase(this.app),
    };

    this.auth = new FirebaseAuth(this.app);
    this.analytics = new FirebaseAnalytics(this.app);
  }
}
