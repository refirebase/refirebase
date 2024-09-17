import type { FirebaseApp } from "firebase/app";

import {
  type FirebaseStorage,
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

import { MESSAGES } from "../config/messages";

export class StorageFirebase {
  storage: FirebaseStorage;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE_APP_NOT_INITIALIZED);
    }

    this.storage = getStorage(app);
  }

  async upload(filePath: string, file: Blob): Promise<string> {
    try {
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error(MESSAGES.STORAGE.UPLOAD_FAILED);
    }
  }

  async update(filePath: string, file: Blob): Promise<string> {
    try {
      const storageRef = ref(this.storage, filePath);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error(MESSAGES.STORAGE.UPDATE_FAILED);
    }
  }

  async get(filePath: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, filePath);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error(MESSAGES.STORAGE.GET_FAILED);
    }
  }

  async delete(filePath: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      throw new Error(MESSAGES.STORAGE.DELETE_FAILED);
    }
  }
}
