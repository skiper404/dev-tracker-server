import { logger } from '../../utils/logger.js';
import { config } from '../../config/config.js';
import { createCollection } from '../../client/collections.js';
import bcrypt from 'bcrypt';

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const usersColl = createCollection(config.db.collections.users);

    const existUser = await usersColl.findOne({ email });
    if (existUser) {
      logger.warn('User with this email already exist', { email });
      return res.status(409).json({ success: false, messageKey: `auth.user_exist` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await usersColl.insertOne({ username, email, hashedPassword, avatar: 'green' });

    res.status(201).json({
      success: true,
      messageKey: `auth.user_create_success`,
      messageParams: { username },
      data: { id: newUser.insertedId },
    });
    logger.info('User successfully created', { username, email });
  } catch (error) {
    logger.error('Internal server error', { message: error.message, stack: error.stack });
    res.status(500).json({ success: false, messageKey: 'auth.user_create_error' });
  }
};
