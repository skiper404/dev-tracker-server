import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';
import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { getFormattedToken } from '../../utils/getToken.js';

export const createApp = async (req, res) => {
  try {
    const app = req.body;
    const token = getFormattedToken(req.headers.authorization);
    const usersColl = createCollection(config.db.collections.users);
    const appsColl = createCollection(config.db.collections.apps);
    const payload = jwt.verify(token, config.jwt.secret);
    const userId = new ObjectId(payload.id);

    const user = await usersColl.findOne({ _id: userId });
    if (!user) {
      logger.warn('User not found when creating app', { userId });
      return res.status(404).json({ success: false, messageKey: 'users.not_found', data: null });
    }

    const result = await appsColl.insertOne({ ...app, userId: userId });

    logger.info('App created successfully', { userId, email: user.email, appId: result.insertedId, appName: app.appName, appType: app.appType });
    res.status(201).json({ success: true, messageKey: `apps.create_success`, messageParams: { appName: app.appName } });
  } catch (error) {
    logger.error('Error creating app', { message: error.message, stack: error.stack });
    return res.status(400).json({ success: false, messageKey: `apps.create_error` });
  }
};
