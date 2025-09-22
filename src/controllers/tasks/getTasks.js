import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';
import { ObjectId } from 'mongodb';
import { getFormattedToken } from '../../utils/getToken.js';
import { createCollection } from '../../client/collections.js';

export const getTasks = async (req, res) => {
  try {
    const token = getFormattedToken(req.headers.authorization);
    const tasksColl = createCollection(config.db.collections.tasks);
    const usersColl = createCollection(config.db.collections.users);
    const payload = jwt.verify(token, config.jwt.secret);
    const userId = new ObjectId(payload.id);
    const appId = new ObjectId(req.params.appId);

    const user = await usersColl.findOne({ _id: userId });

    if (!user) {
      logger.warn('User not found when getting tasks', { userId });
      return res.status(404).json({ success: false, messageKey: 'users.not_found', data: null });
    }

    const tasks = await tasksColl.find({ userId: userId, appId: appId }).toArray();
    if (!tasks) {
      logger.warn('Tasks not created yet', { userId, appId });
      return res.status(200).json({ success: false, messageKey: 'tasks.not_created', data: [] });
    }

    logger.info('Tasks retrieved successfully', { userId, email: user.email, tasksCount: tasks.length });
    res.status(200).json({ success: true, messageKey: `tasks.fetch_success`, data: tasks });
  } catch (error) {
    logger.error('Error getting apps', { message: error.message, stack: error.stack });
    return res.status(200).json({ success: false, messageKey: `task.fetch_error` });
  }
};
