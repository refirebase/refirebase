import { initializeFirebase } from "./firebase";

import { FirestoreDatabase } from "./firebase/firestore";
import { RealtimeDatabase } from "./firebase/realtime";

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

  readonly firestore = new FirestoreDatabase();
  readonly realtime = new RealtimeDatabase();

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
