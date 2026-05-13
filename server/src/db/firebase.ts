import type { DbAdapter } from './adapter.js';

export class FirebaseAdapter<T extends { id: string }> implements DbAdapter<T> {
  private collection: string;

  constructor(collection: string) {
    this.collection = collection;
    console.warn(`[FirebaseAdapter] Collection "${collection}" is not implemented yet. Falling back to no-op.`);
  }

  findAll(): T[] {
    throw new Error('Firebase adapter not implemented yet. Set DB_TYPE=json to use JsonDb.');
  }

  findById(_id: string): T | undefined {
    throw new Error('Firebase adapter not implemented yet. Set DB_TYPE=json to use JsonDb.');
  }

  findOne(_predicate: (item: T) => boolean): T | undefined {
    throw new Error('Firebase adapter not implemented yet. Set DB_TYPE=json to use JsonDb.');
  }

  create(_item: Omit<T, 'id'> & { id?: string }): T {
    throw new Error('Firebase adapter not implemented yet. Set DB_TYPE=json to use JsonDb.');
  }

  update(_id: string, _updates: Partial<T>): T | null {
    throw new Error('Firebase adapter not implemented yet. Set DB_TYPE=json to use JsonDb.');
  }

  delete(_id: string): boolean {
    throw new Error('Firebase adapter not implemented yet. Set DB_TYPE=json to use JsonDb.');
  }
}
