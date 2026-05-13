export interface DbAdapter<T extends { id: string }> {
  findAll(): T[];
  findById(id: string): T | undefined;
  findOne(predicate: (item: T) => boolean): T | undefined;
  create(item: Omit<T, 'id'> & { id?: string }): T;
  update(id: string, updates: Partial<T>): T | null;
  delete(id: string): boolean;
}

export function createAdapter<T extends { id: string }>(collection: string): DbAdapter<T> {
  const mode = process.env.DB_TYPE || 'json';

  if (mode === 'postgres') {
    const { PostgresAdapter } = require('./postgres.js');
    return new PostgresAdapter(collection) as DbAdapter<T>;
  }

  if (mode === 'firebase') {
    const { FirebaseAdapter } = require('./firebase.js');
    return new FirebaseAdapter(collection) as DbAdapter<T>;
  }

  // Default: json
  const { JsonAdapter } = require('./json.js');
  return new JsonAdapter(collection) as DbAdapter<T>;
}
