import { getDb } from '../config/db.js';

const COLLECTION = 'customers';

export const Customer = {
  collection: () => getDb().collection(COLLECTION),

  validate: (data) => {
    const errors = [];
    if (!data.user) errors.push('User ID is required');
    return errors;
  },

  createIndexes: async () => {
    const db = getDb();
    await db.collection(COLLECTION).createIndex({ user: 1 }, { unique: true });
  }
};
