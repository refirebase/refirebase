import { version } from "../package.json";

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

    console.log(`Refirebase version: ${version}`);
    console.log("Firebase configuration:", this.config);
  }
}
