import type { FirebaseApp } from "firebase/app";

import {
  type Database as FirebaseDatabase,
  get,
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

import { MESSAGES } from "../config/messages";

export class RealtimeDatabase {
  db: FirebaseDatabase;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.db = getDatabase(app);
  }

  /**
   * Retrieves data from the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @returns The data at the specified path or null if the data does not exist.
   */
  async get(path: string): Promise<unknown | { error: unknown }> {
    try {
      const snapshot = await get(ref(this.db, path));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      return { error };
    }
  }

  async onValue(path: string, callback: (data: unknown) => void) {
    const dbRef = ref(this.db, path);
    const snapshot = await get(dbRef);
    callback(snapshot.val());

    return onValue(dbRef, (snapshot) => {
      callback(snapshot.val());
    });
  }

  /**
   * Sets data in the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @param data - The data to set.
   *
   * @returns An error object if the operation fails.
   */
  async set(
    path: string,
    data: unknown
  ): Promise<undefined | { error: unknown }> {
    try {
      await set(ref(this.db, path), data);
    } catch (error) {
      return { error };
    }
  }

  /**
   * Updates data in the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @param data - The data to update.
   *
   * @returns An error object if the operation fails.
   */
  async update(
    path: string,
    data: object
  ): Promise<undefined | { error: unknown }> {
    try {
      await update(ref(this.db, path), data);
    } catch (error) {
      return { error };
    }
  }

  /**
   * Deletes data from the Firebase Realtime Database.
   *
   * @param path - The path to the data in the database.
   * @returns An error object if the operation fails.
   */
  async delete(path: string): Promise<undefined | { error: unknown }> {
    try {
      await remove(ref(this.db, path));
    } catch (error) {
      return { error };
    }
  }
}
