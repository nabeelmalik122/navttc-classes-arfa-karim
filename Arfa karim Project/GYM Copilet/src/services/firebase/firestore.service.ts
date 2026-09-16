import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  onSnapshot,
  serverTimestamp,
  type QueryConstraint,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { AppError } from '@/core/errors/AppError';

export interface IBaseRepository<T extends { id: string }> {
  getById(id: string): Promise<T | null>;
  getAll(constraints?: QueryConstraint[]): Promise<T[]>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, customId?: string): Promise<string>;
  update(id: string, patch: Partial<T>): Promise<void>;
  delete(id: string): Promise<void>;
  subscribeOne(id: string, onUpdate: (item: T | null) => void, onError?: (error: Error) => void): Unsubscribe;
  subscribeMany(constraints: QueryConstraint[], onUpdate: (items: T[]) => void, onError?: (error: Error) => void): Unsubscribe;
}

export class FirestoreRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected readonly collectionPath: string;

  constructor(collectionPath: string) {
    this.collectionPath = collectionPath;
  }

  protected getCollectionRef() {
    return collection(db, this.collectionPath);
  }

  protected getDocRef(id: string) {
    return doc(db, this.collectionPath, id);
  }

  async getById(id: string): Promise<T | null> {
    try {
      const snap = await getDoc(this.getDocRef(id));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as T;
    } catch (err) {
      throw new AppError(`Failed to fetch document ${id} from ${this.collectionPath}`, 'FIRESTORE_READ_ERROR', 'error', err);
    }
  }

  async getAll(constraints: QueryConstraint[] = []): Promise<T[]> {
    try {
      const q = query(this.getCollectionRef(), ...constraints);
      const snap = await getDocs(q);
      return snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as T));
    } catch (err) {
      throw new AppError(`Failed to query collection ${this.collectionPath}`, 'FIRESTORE_QUERY_ERROR', 'error', err);
    }
  }

  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>, customId?: string): Promise<string> {
    try {
      const docRef = customId ? this.getDocRef(customId) : doc(this.getCollectionRef());
      const payload = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(docRef, payload);
      return docRef.id;
    } catch (err) {
      throw new AppError(`Failed to create document in ${this.collectionPath}`, 'FIRESTORE_WRITE_ERROR', 'error', err);
    }
  }

  async update(id: string, patch: Partial<T>): Promise<void> {
    try {
      const docRef = this.getDocRef(id);
      const payload = {
        ...patch,
        updatedAt: serverTimestamp(),
      };
      await updateDoc(docRef, payload);
    } catch (err) {
      throw new AppError(`Failed to update document ${id} in ${this.collectionPath}`, 'FIRESTORE_UPDATE_ERROR', 'error', err);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await deleteDoc(this.getDocRef(id));
    } catch (err) {
      throw new AppError(`Failed to delete document ${id} in ${this.collectionPath}`, 'FIRESTORE_DELETE_ERROR', 'error', err);
    }
  }

  subscribeOne(
    id: string,
    onUpdate: (item: T | null) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    return onSnapshot(
      this.getDocRef(id),
      (snap) => {
        if (!snap.exists()) {
          onUpdate(null);
        } else {
          onUpdate({ id: snap.id, ...snap.data() } as T);
        }
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  }

  subscribeMany(
    constraints: QueryConstraint[],
    onUpdate: (items: T[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const q = query(this.getCollectionRef(), ...constraints);
    return onSnapshot(
      q,
      (snap) => {
        const items = snap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as T));
        onUpdate(items);
      },
      (err) => {
        if (onError) onError(err);
      }
    );
  }
}
