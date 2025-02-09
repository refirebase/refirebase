import type { FirebaseApp } from "firebase/app";

import {
  type Firestore as FirebaseFirestore,
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
  CollectionReference,
  Query,
  WhereFilterOp,
} from "firebase/firestore";

import {
  GetByCondition,
  GetById,
  ReturnGenericObj,
  WhereCondition,
  FirestoreError,
} from "../types/firebase/firestore";

import { MESSAGES } from "../config/messages";

export class FirestoreDatabase {
  db: FirebaseFirestore;

  constructor(app: FirebaseApp) {
    if (!app) {
      throw new Error(MESSAGES.FIREBASE.APP_NOT_INITIALIZED);
    }

    this.db = getFirestore(app);
  }

  private flattenWhereConditions<T>(
    conditions: WhereCondition<T>,
    prefix = ""
  ): Record<string, unknown> {
    return Object.entries(conditions).reduce(
      (acc, [key, value]) => {
        if (typeof value === "object" && value !== null) {
          if ("operator" in value) {
            return { ...acc, [`${prefix}${key}`]: value };
          }

          if ("not" in value) {
            return { ...acc, [`${prefix}${key}`]: value };
          }

          return {
            ...acc,
            ...this.flattenWhereConditions(value as WhereCondition<T>, `${key}.`),
          };
        }

        return { ...acc, [`${prefix}${key}`]: value };
      },
      {} as Record<string, unknown>,
    );
  }

  private buildWhereQuery<T>(
    collectionRef: CollectionReference,
    conditions?: WhereCondition<T>
  ): Query {
    if (!conditions) {
      return query(collectionRef);
    }

    let q = query(collectionRef);
    const flattened = this.flattenWhereConditions(conditions);

    Object.entries(flattened).forEach(([field, condition]) => {
      if (
        typeof condition === "object" &&
        condition !== null &&
        "operator" in condition
      ) {
        const { operator, value } = condition as {
          operator: WhereFilterOp;
          value: unknown;
        };
        q = query(q, where(field, operator, value));
      } else if (
        typeof condition === "object" &&
        condition !== null &&
        "not" in condition
      ) {
        const { not } = condition as { not: unknown };
        q = query(q, where(field, "!=", not));
      } else {
        q = query(q, where(field, "==", condition));
      }
    });

    return q;
  }

  /**
   * Retrieves data from the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to retrieve data from.
   * @param options - The options for retrieving the data.
   *
   * @returns The data at the specified path or null if the data does not exist.
   */
  async get<T>(
    collectionName: string,
    options?: GetById | GetByCondition<T>
  ): Promise<T[] | null | FirestoreError> {
    try {
      const collectionRef = collection(this.db, collectionName);

      if (options && options.docId) {
        const docRef = doc(this.db, collectionName, options.docId as string);
        const docSnap = await getDoc(docRef);

        return docSnap.exists()
          ? ([
              {
                id: docSnap.id,
                ...docSnap.data(),
              },
            ] as ReturnGenericObj<T>[])
          : null;
      }

      const q = this.buildWhereQuery<T>(collectionRef, options?.where);
      const querySnapshot = await getDocs(q);

      return querySnapshot.empty
        ? []
        : (querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as ReturnGenericObj<T>[]);
    } catch (error) {
      return { error };
    }
  }

  /**
   * Adds data to the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to add data to.
   * @param data - The data to add to the collection.
   * @param id - The ID of the document to add the data to.
   *
   * @returns The data that was added to the collection or an error object if the operation fails.
   */
  async add<T = Record<string, unknown>>(
    collectionName: string,
    data: T,
    docId?: string
  ): Promise<ReturnGenericObj<T> | FirestoreError> {
    try {
      const docRef = docId
        ? doc(this.db, collectionName, docId)
        : doc(collection(this.db, collectionName));

      const timestamp = new Date().toISOString();
      const object =
        typeof data === "object" && data !== null
          ? data
          : { [collectionName]: data };

      await setDoc(docRef, {
        ...object,
        created_at: timestamp,
        updated_at: timestamp,
      });
      return { id: docRef.id, ...object } as ReturnGenericObj<T>;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Updates data in the Firebase Firestore.
   *
   * @param collectionName - The name of the collection to update data in.
   * @param doc_id - The ID of the document to update.
   * @param data - The data to update in the document.
   *
   * @returns An error object if the operation fails.
   */
  async set<T = Record<string, unknown>>(
    collectionName: string,
    docId: string,
    data: T
  ): Promise<void | FirestoreError> {
    try {
      const timestamp = new Date().toISOString();
      const object =
        typeof data === "object" && data !== null
          ? data
          : { [collectionName]: data };

      await setDoc(doc(this.db, collectionName, docId), {
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
  async update<T = Record<string, unknown>>(
    collectionName: string,
    docId: string,
    data: T
  ): Promise<void | FirestoreError> {
    try {
      const timestamp = new Date().toISOString();
      const object =
        typeof data === "object" && data !== null
          ? data
          : { [collectionName]: data };

      await updateDoc(doc(this.db, collectionName, docId), {
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
    docId: string
  ): Promise<void | FirestoreError> {
    try {
      await deleteDoc(doc(this.db, collection, docId));
    } catch (error) {
      return { error };
    }
  }
}
