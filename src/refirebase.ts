import { initializeFirebase } from "./firebase";

import { FirestoreDatabase } from "./firebase/firestore";
import { RealtimeDatabase } from "./firebase/realtime";
import { StorageFirebase } from "./firebase/storage";

import { FirebaseAuth } from "./firebase/auth";

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

  readonly db = {
    firestore: new FirestoreDatabase(),
    realtime: new RealtimeDatabase(),
    storage: new StorageFirebase(),
  };

  readonly auth = new FirebaseAuth();

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

    initializeFirebase(this.config);
  }
}
