import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';
import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { getFormattedToken } from '../../utils/getToken.js';

export const createTask = async (req, res) => {
  try {
    const task = req.body;
    const token = getFormattedToken(req.headers.authorization);
    const usersColl = createCollection(config.db.collections.users);
    const tasksColl = createCollection(config.db.collections.tasks);
    const payload = jwt.verify(token, config.jwt.secret);
    const userId = new ObjectId(payload.id);
    const appId = new ObjectId(req.params.appId);

    const user = await usersColl.findOne({ _id: userId });
    if (!user) {
      logger.warn('User not found when getting tasks', { userId });
      return res.status(404).json({ success: false, messageKey: 'users.not_found', data: null });
    }

    const result = await tasksColl.insertOne({ ...task, userId: userId, appId: appId, createdAt: Date.now() });
    logger.info('Task has created', { userId, email: user.email, taskId: result.insertedId });
    res.status(201).json({ success: true, messageKey: `tasks.create_success`, messageParams: { taskName: task.taskName } });
  } catch (error) {
    logger.error('Error getting apps', { message: error.message, stack: error.stack });
    return res.status(400).json({ success: false, messageKey: `tasks.create_error` });
  }
};
