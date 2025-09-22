import { createCollection } from '../../client/collections.js';
import { config } from '../../config/config.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { logger } from '../../utils/logger.js';

export const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        logger.warn('Token expired for password reset', { token });
        return res.status(400).json({ success: false, messageKey: 'auth.token_expired' });
      } else {
        logger.warn('Invalid token for password reset', { token });
        return res.status(400).json({ success: false, messageKey: 'auth.token_invalid' });
      }
    }

    const usersColl = createCollection(config.db.collections.users);
    const user = await usersColl.findOne({ _id: new ObjectId(payload.id) });

    if (!user) {
      logger.warn('User not found for password reset', { userId: payload.id });
      return res.status(404).json({ success: false, messageKey: 'users.not_found' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await usersColl.updateOne({ _id: user._id }, { $set: { hashedPassword } });

    res.status(201).json({ success: true, messageKey: 'auth.password_change_success' });
    logger.info('Password successfully changed', { userId: user._id, email: user.email });
  } catch (error) {
    logger.error('Internal server error during password reset', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, messageKey: 'auth.password_change_error' });
  }
};
