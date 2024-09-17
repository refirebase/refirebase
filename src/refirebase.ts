import { initializeFirebase } from "./firebase";

import { FirestoreDatabase } from "./firebase/firestore";
import { RealtimeDatabase } from "./firebase/realtime";
import { StorageFirebase } from "./firebase/storage";

import { FirebaseAuth } from "./firebase/auth";

import type { FirebaseApp } from "firebase/app";

export class Refirebase {
  private readonly config: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };

  private readonly app: FirebaseApp;

  readonly db: {
    firestore: FirestoreDatabase;
    realtime: RealtimeDatabase;
    storage: StorageFirebase;
  };

  readonly auth: FirebaseAuth;

  constructor(config: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }) {
    if (
      !config.apiKey ||
      !config.authDomain ||
      !config.databaseURL ||
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

    this.app = initializeFirebase(this.config);

    this.db = {
      firestore: new FirestoreDatabase(this.app),
      realtime: new RealtimeDatabase(this.app),
      storage: new StorageFirebase(this.app),
    };

    this.auth = new FirebaseAuth(this.app);
  }
}
