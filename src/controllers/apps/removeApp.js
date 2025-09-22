import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';
import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { getFormattedToken } from '../../utils/getToken.js';

export const removeApp = async (req, res) => {
  try {
    const token = getFormattedToken(req.headers.authorization);
    const usersColl = createCollection(config.db.collections.users);
    const appsColl = createCollection(config.db.collections.apps);
    const tasksColl = createCollection(config.db.collections.tasks);
    const payload = jwt.verify(token, config.jwt.secret);
    const userId = new ObjectId(payload.id);
    const appId = new ObjectId(req.params.id);

    const user = await usersColl.findOne({ _id: userId });
    if (!user) {
      logger.warn('User not found when removing apps', { userId });
      return res.status(404).json({ success: false, messageKey: 'users.not_found', data: null });
    }

    const app = await appsColl.findOneAndDelete({ _id: appId, userId: userId });
    const result = await tasksColl.deleteMany({ appId: appId });

    if (!app) {
      logger.warn('App not found or not owner by user', { userId });
      return res.status(404).json({ success: false, messageKey: 'apps.not_found', data: null });
    }

    res.status(200).json({
      success: true,
      messageKey: `apps.remove_success`,
      messageParams: { appName: app.appName },
      data: null,
    });
    logger.info('App and related tasks removed successfully', {
      userId,
      email: user.email,
      appId: result.insertedId,
      appName: app.appName,
    });
  } catch (error) {
    logger.error('Error creating app', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, messageKey: `apps.remove_error`, data: null });
  }
};
