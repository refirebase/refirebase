import {
  type Database as FirebaseDatabase,
  get,
  getDatabase,
  ref,
  remove,
  set,
  update,
} from "firebase/database";

import { app } from ".";

export class RealtimeDatabase {
  db: FirebaseDatabase;

  constructor() {
    if (!app) throw new Error("Firebase app not initialized");
    this.db = getDatabase(app);
  }

  async get(path: string): Promise<unknown | { error: unknown }> {
    try {
      const snapshot = await get(ref(this.db, path));
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      return { error };
    }
  }

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

  async delete(path: string): Promise<undefined | { error: unknown }> {
    try {
      await remove(ref(this.db, path));
    } catch (error) {
      return { error };
    }
  }
}
