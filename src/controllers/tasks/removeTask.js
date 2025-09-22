import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';
import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { getFormattedToken } from '../../utils/getToken.js';

export const removeTask = async (req, res) => {
  try {
    const token = getFormattedToken(req.headers.authorization);
    const tasksColl = createCollection(config.db.collections.tasks);
    const usersColl = createCollection(config.db.collections.users);
    const payload = jwt.verify(token, config.jwt.secret);
    const _userId = new ObjectId(payload.id);
    const _taskId = new ObjectId(req.params.taskId);
    const _appId = new ObjectId(req.params.appId);

    const user = await usersColl.findOne({ _id: _userId });
    if (!user) {
      logger.warn('User not found', { userId: _userId });
      return res.status(404).json({ success: false, messageKey: 'users.not_found', data: null });
    }

    const task = await tasksColl.findOneAndDelete({ _id: _taskId, userId: _userId, appId: _appId });

    if (!task) {
      return res.status(404).json({ success: false, messageKey: 'tasks.not_found', data: null });
    }

    logger.info('Task removed successfully', {
      userId: _userId,
      email: user.email,
      taskId: _taskId,
      taskName: task.taskName,
    });
    res.status(200).json({ success: true, messageKey: `tasks.remove_success`, messageParams: { taskName: task.taskName }, data: null });
  } catch (error) {
    logger.error('Error removed task', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, messageKey: `tasks.remove_error`, data: null });
  }
};
