import { config } from '../config/config.js';
import { client } from './client.js';

export const createCollection = (name) => {
  return client.db(config.db.name).collection(name);
};
