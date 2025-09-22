import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';
import { ObjectId } from 'mongodb';
import { getFormattedToken } from '../../utils/getToken.js';
import { createCollection } from '../../client/collections.js';

export const getApps = async (req, res) => {
  try {
    const token = getFormattedToken(req.headers.authorization);
    const appsColl = createCollection(config.db.collections.apps);
    const usersColl = createCollection(config.db.collections.users);
    const payload = jwt.verify(token, config.jwt.secret);
    const userId = new ObjectId(payload.id);

    const user = await usersColl.findOne({ _id: userId });
    if (!user) {
      logger.warn('User not found when getting apps', { userId });
      return res.status(404).json({ success: false, messageKey: 'users.not_found', data: null });
    }

    const apps = await appsColl.find({ userId: userId }).toArray();

    if (!apps.length) {
      logger.warn('Apps not created yet', { userId, email: user.email });
      return res.status(200).json({ success: true, messageKey: 'apps.empty', data: [] });
    }

    res.status(200).json({ success: true, messageKey: `apps.fetch_success`, data: apps });
    logger.info('Apps retrieved successfully', { userId, email: user.email, appsCount: apps.length });
  } catch (error) {
    logger.error('Error getting apps', { message: error.message, stack: error.stack });
    return res.status(200).json({ success: false, messageKey: `apps.fetch_error` });
  }
};
