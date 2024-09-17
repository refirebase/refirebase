import type { FirebaseApp } from "firebase/app";

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
} from "firebase/firestore";

import { MESSAGES } from "../config/messages";

export class FirestoreDatabase {
  db: FirebaseFirestore;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE_APP_NOT_INITIALIZED);
    }

    this.db = getFirestore(app);
  }

  async get(
    collectionName: string,
    docId?: string
  ): Promise<unknown | unknown[] | null | { error: unknown }> {
    try {
      if (docId) {
        const docRef = doc(this.db, collectionName, docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
        return null;
      }

      const collectionRef = collection(this.db, collectionName);
      const querySnapshot = await getDocs(collectionRef);

      return querySnapshot.empty
        ? []
        : querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return { error };
    }
  }

  async find(
    collectionName: string,
    conditions: {
      field: string;
      operator: WhereFilterOperator;
      value: unknown;
    }[]
  ): Promise<unknown[] | { error: unknown }> {
    try {
      const collectionRef = collection(this.db, collectionName);
      const q = conditions.reduce(
        (q, { field, operator, value }) =>
          query(q, where(field, operator, value)),
        query(collectionRef)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty
        ? []
        : querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return { error };
    }
  }

  async add(
    collection_name: string,
    data: unknown,
    id?: string
  ): Promise<unknown | { error: unknown }> {
    try {
      const docRef = id
        ? doc(this.db, collection_name, id)
        : doc(collection(this.db, collection_name));

      const timestamp = new Date().toISOString();
      const dataObject = typeof data === "object" ? data : {};

      await setDoc(docRef, {
        ...dataObject,
        created_at: timestamp,
        updated_at: timestamp,
      });
      return { id: docRef.id, ...dataObject };
    } catch (error) {
      return { error };
    }
  }

  async set(
    collection: string,
    docId: string,
    data: unknown
  ): Promise<undefined | { error: unknown }> {
    try {
      await setDoc(doc(this.db, collection, docId), data);
    } catch (error) {
      return { error };
    }
  }

  async update(
    collection: string,
    docId: string,
    data: object
  ): Promise<undefined | { error: unknown }> {
    try {
      await updateDoc(doc(this.db, collection, docId), data);
    } catch (error) {
      return { error };
    }
  }

  async delete(
    collection: string,
    docId: string
  ): Promise<undefined | { error: unknown }> {
    try {
      await deleteDoc(doc(this.db, collection, docId));
    } catch (error) {
      return { error };
    }
  }
}
