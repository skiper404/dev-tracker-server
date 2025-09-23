import dotenv from 'dotenv';
dotenv.config();

export const config = {
  app: {
    port: process.env.PORT || 3000,
  },
  client_url: process.env.CLIENT_URL || 'http://localhost:5173',
  jwt: { secret: process.env.JWT_SECRET },
  resend: { apiKey: process.env.RESEND_API_KEY },
  db: {
    url: process.env.MONGO_URL,
    name: process.env.MONGO_DB,
    collections: {
      users: 'users',
      apps: 'apps',
      tasks: 'tasks',
    },
  },
};
