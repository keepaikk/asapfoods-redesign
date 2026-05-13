import fs from 'fs';
import path from 'path';
import type { DbAdapter } from './adapter.js';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export class JsonAdapter<T extends { id: string }> implements DbAdapter<T> {
  private filePath: string;

  constructor(collection: string) {
    this.filePath = path.join(DATA_DIR, `${collection}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  private read(): T[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data) as T[];
    } catch {
      return [];
    }
  }

  private write(data: T[]): void {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  findAll(): T[] {
    return this.read();
  }

  findById(id: string): T | undefined {
    return this.read().find((item) => item.id === id);
  }

  findOne(predicate: (item: T) => boolean): T | undefined {
    return this.read().find(predicate);
  }

  create(item: Omit<T, 'id'> & { id?: string }): T {
    const items = this.read();
    const newItem = { ...item, id: item.id || crypto.randomUUID() } as T;
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  update(id: string, updates: Partial<T>): T | null {
    const items = this.read();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    this.write(items);
    return items[index];
  }

  delete(id: string): boolean {
    const items = this.read();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.write(filtered);
    return true;
  }
}
