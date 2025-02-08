import { WhereFilterOp as WhereFilterOperator } from "firebase/firestore";

export type ReturnGenericObj<T> = T & { id: string };

export type GetById = { docId: string; where?: never };

export type GetByCondition<T> = { docId?: never; where: WhereCondition<T> };

export type FirestoreError = { error: Error | unknown };

export type WhereCondition<T> = {
  [K in keyof T]?:
    | T[K]
    | { operator: WhereFilterOperator; value: T[K] }
    | { not: T[K] };
};
