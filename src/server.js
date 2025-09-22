import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './client/client.js';
import { router } from './router/index.js';
import { config } from './config/config.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(router);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server works!' });
});

const start = async () => {
  try {
    console.log('Starting server...');
    await connectDB();
    app.listen(config.app.port, () => console.log(`Server listen port ${config.app.port}`));
  } catch (error) {
    console.error('Error starting server');
  }
};
start();
