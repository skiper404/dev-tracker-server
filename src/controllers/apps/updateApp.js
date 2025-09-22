import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { getFormattedToken } from '../../utils/getToken.js';
import { logger } from '../../utils/logger.js';

export const updateApp = async (req, res) => {
  try {
    const { appName, appType } = req.body;
    const updatedApp = { appName, appType };
    const token = getFormattedToken(req.headers.authorization);
    const usersColl = createCollection(config.db.collections.users);
    const appsColl = createCollection(config.db.collections.apps);
    const payload = jwt.verify(token, config.jwt.secret);
    const userId = new ObjectId(payload.id);
    const appId = new ObjectId(req.params.id);

    const user = await usersColl.findOne({ _id: userId });
    if (!user) {
      logger.warn('User not found when updated app', { userId });
      return res.status(404).json({ success: false, messageKey: 'users.not_found', data: null });
    }

    const app = await appsColl.findOneAndUpdate({ _id: appId, userId: userId }, { $set: updatedApp }, { returnDocument: 'after' });

    if (!app) {
      return res.status(404).json({ success: false, messageKey: 'apps.not_found', data: null });
    }

    logger.info('App updated successfully', { userId, email: user.email, appId: app._id, appName: app.appName, appType: app.appType });
    res.status(200).json({ success: true, messageKey: `apps.update_success`, messageParams: { appName: app.appName } });
  } catch (error) {
    logger.error('Error updating app', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, messageKey: 'apps.update_error', data: null });
  }
};
