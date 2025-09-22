import { createCollection } from '../../client/collections.js';
import { config } from '../../config/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userColl = createCollection(config.db.collections.users);

    const existUser = await userColl.findOne({ email: email });
    if (!existUser) {
      logger.warn('Wrong email or password');
      return res.status(401).json({
        success: false,
        messageKey: 'auth.user_wrong_email_or_password',
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, existUser.hashedPassword);
    if (!isMatch) {
      logger.warn('Wrong email or password');
      return res.status(401).json({ success: false, messageKey: 'auth.user_wrong_email_or_password', data: null });
    }

    const token = jwt.sign({ id: existUser._id.toString() }, config.jwt.secret, {
      expiresIn: '7d',
    });

    logger.info('Successfully login', { email: existUser.email, username: existUser.username, userId: existUser._id });
    res.status(200).json({ success: true, messageKey: `auth.user_login_success`, messageParams: { username: existUser.username }, data: token });
  } catch (error) {
    logger.error('Internal server error', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, messageKey: 'auth.user_login_error' });
  }
};
