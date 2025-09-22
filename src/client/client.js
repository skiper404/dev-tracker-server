import { MongoClient } from 'mongodb';
import { config } from '../config/config.js';

export const client = new MongoClient(config.db.url);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to DB');
  } catch (error) {
    console.error('Error connection to DB');
    console.error('Server stopped');
    process.exit(1);
  }
};
