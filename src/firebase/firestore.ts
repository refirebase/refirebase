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

interface WhereCondition {
  field: string;
  op: WhereFilterOperator;
  value: unknown;
}

interface GetOptions {
  docId?: string;
  where?: unknown;
}

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
   * @param options - Optional object with a "where" clause for filtering or "docId" for specific document.
   *
   * @returns The data at the specified path or null if the data does not exist.
   */
  async get(
    collectionName: string,
    options?: GetOptions,
  ): Promise<unknown | unknown[] | null | { error: unknown }> {
    try {
      const collectionRef = collection(this.db, collectionName);

      // If docId is provided, fetch the specific document
      if (options?.docId) {
        const docRef = doc(this.db, collectionName, options.docId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
      }

      // Convert the where expression to string and parse it
      const conditions = this.parseWhereExpression(options?.where);

      // Start query with the collection reference and apply conditions
      let q = query(collectionRef);
      for (const condition of conditions) {
        const { field, op, value } = condition;
        q = query(q, where(field, op, value));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty
        ? []
        : querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error retrieving data from Firestore:', error);
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
      const dataObject = typeof data === 'object' ? data : {};

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
      await setDoc(doc(this.db, collection, docId), data);
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
      await updateDoc(doc(this.db, collection, docId), data);
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

  /**
   * Parses a boolean expression from the where clause and converts it into Firestore conditions.
   * Supports all comparison operators from `WhereFilterOperator`.
   */
  private parseWhereExpression(expression: unknown): WhereCondition[] {
    if (typeof expression !== 'string') {
      throw new Error('Invalid where expression: must be a string.');
    }

    const operators: Record<string, WhereFilterOperator> = {
      '>=': '>=',
      '<=': '<=',
      '==': '==',
      '!=': '!=',
      '>': '>',
      '<': '<',
    };

    // Matches expressions like "field >= value" or "field == value"
    const conditionRegex = /(\w+)\s*(>=|<=|==|!=|>|<)\s*([\w"']+)/g;
    const conditions: WhereCondition[] = [];

    let match: RegExpExecArray | null;

    while (true) {
      match = conditionRegex.exec(expression);
      if (match === null) break;

      const [, field, operator, value] = match;
      const parsedValue = this.parseValue(value);

      conditions.push({
        field,
        op: operators[operator],
        value: parsedValue,
      });
    }

    return conditions;
  }

  /**
   * Parses a value from a string (handles numbers, booleans, and strings).
   * Removes quotes from string values.
   */
  private parseValue(value: string): unknown {
    if (/^\d+$/.test(value)) return Number(value);

    if (value === 'true') return true;
    if (value === 'false') return false;

    return value.replace(/['"]/g, '');
  }
}
