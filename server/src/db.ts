export { createAdapter } from './db/adapter.js';
export { JsonAdapter } from './db/json.js';
export { PostgresAdapter } from './db/postgres.js';
export { FirebaseAdapter } from './db/firebase.js';

// Backward compatibility: JsonDb is an alias for JsonAdapter
import { JsonAdapter } from './db/json.js';
export const JsonDb = JsonAdapter;
