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
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.storage = getStorage(app);
  }

  /**
   * Uploads a file to the Firebase Storage.
   *
   * @param filePath - The path to the file in the storage bucket.
   * @param file - The file to upload.
   */
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

  /**
   * Retrieves a file from the Firebase Storage.
   *
   * @param filePath - The path to the file in the storage bucket.
   * @returns The download URL of the file.
   */
  async get(filePath: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, filePath);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error(MESSAGES.STORAGE.GET_FAILED);
    }
  }

  /**
   * Updates a file in the Firebase Storage.
   *
   * @param filePath - The path to the file in the storage bucket.
   * @param file - The file to update.
   */
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

  /**
   * Deletes a file from the Firebase Storage.
   *
   * @param filePath - The path to the file in the storage bucket.
   * @returns A promise that resolves when the file is deleted.
   */
  async delete(filePath: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      throw new Error(MESSAGES.STORAGE.DELETE_FAILED);
    }
  }
}
