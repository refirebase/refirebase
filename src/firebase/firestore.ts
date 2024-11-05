import type { FirebaseApp } from 'firebase/app';

import {
  type Firestore as FirebaseFirestore,
  type WhereFilterOp as WhereFilterOperator,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { MESSAGES } from '../config/messages';

export class FirestoreDatabase {
  db: FirebaseFirestore;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.db = getFirestore(app);
  }

  /**
   * Retrieves data from the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to retrieve data from.
   * @param docId - Optional ID of the document to retrieve.
   * @param conditions - Optional array of conditions to filter the data by.
   *
   * @returns The data at the specified path or null if the data does not exist.
   */
  async get(
    collectionName: string,
    docId?: string,
    conditions?: {
      field: string;
      operator: WhereFilterOperator;
      value: unknown;
    }[],
  ): Promise<unknown | unknown[] | null | { error: unknown }> {
    try {
      const collectionRef = collection(this.db, collectionName);

      // If docId is provided, fetch the specific document
      if (docId) {
        const docRef = doc(this.db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        return docSnap.exists()
          ? {
              id: docSnap.id,
              ...docSnap.data(),
            }
          : null;
      }

      // If conditions are provided, apply them
      const q = conditions
        ? conditions.reduce(
            (q, { field, operator, value }) =>
              query(q, where(field, operator, value)),
            query(collectionRef),
          )
        : query(collectionRef);

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty
        ? []
        : querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return { error };
    }
  }

  /**
   * Adds data to the Firebase Firestore.
   *
   * @param collection_name - The name of the collection to add data to.
   * @param data - The data to add to the collection.
   * @param id - The ID of the document to add the data to.
   *
   * @returns The data that was added to the collection or an error object if the operation fails.
   */
  async add(
    collection_name: string,
    data: unknown,
    id?: string,
  ): Promise<unknown | { error: unknown }> {
    try {
      const docRef = id
        ? doc(this.db, collection_name, id)
        : doc(collection(this.db, collection_name));

      const timestamp = new Date().toISOString();
      const object = typeof data === 'object' ? data : {};

      await setDoc(docRef, {
        ...object,
        created_at: timestamp,
        updated_at: timestamp,
      });
      return { id: docRef.id, ...object };
    } catch (error) {
      return { error };
    }
  }

  /**
   * Updates data in the Firebase Firestore.
   *
   * @param collection_name - The name of the collection to update data in.
   * @param doc_id - The ID of the document to update.
   * @param data - The data to update in the document.
   *
   * @returns An error object if the operation fails.
   */
  async set(
    collection: string,
    docId: string,
    data: unknown,
  ): Promise<undefined | { error: unknown }> {
    try {
      const timestamp = new Date().toISOString();
      const object = typeof data === 'object' ? data : {};

      await setDoc(doc(this.db, collection, docId), {
        ...object,
        updated_at: timestamp,
      });
    } catch (error) {
      return { error };
    }
  }

  /**
   * Updates data in the Firebase Firestore.
   *
   * @param collection - The name of the collection to update data in.
   * @param docId - The ID of the document to update.
   * @param data - The data to update in the document.
   *
   * @returns An error object if the operation fails.
   */
  async update(
    collection: string,
    docId: string,
    data: object,
  ): Promise<undefined | { error: unknown }> {
    try {
      const timestamp = new Date().toISOString();
      const object = typeof data === 'object' ? data : {};

      await updateDoc(doc(this.db, collection, docId), {
        ...object,
        updated_at: timestamp,
      });
    } catch (error) {
      return { error };
    }
  }

  /**
   * Deletes data from the Firebase Firestore.
   *
   * @param collection - The name of the collection to delete data from.
   * @param docId - The ID of the document to delete.
   *
   * @returns An error object if the operation fails.
   */
  async delete(
    collection: string,
    docId: string,
  ): Promise<undefined | { error: unknown }> {
    try {
      await deleteDoc(doc(this.db, collection, docId));
    } catch (error) {
      return { error };
    }
  }
}
