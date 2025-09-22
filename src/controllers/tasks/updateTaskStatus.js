import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { logger } from '../../utils/logger.js';
import { ObjectId } from 'mongodb';
import { createCollection } from '../../client/collections.js';
import { getFormattedToken } from '../../utils/getToken.js';

export const updateTaskStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;
    const token = getFormattedToken(req.headers.authorization);
    const usersColl = createCollection(config.db.collections.users);
    const tasksColl = createCollection(config.db.collections.tasks);
    const payload = jwt.verify(token, config.jwt.secret);
    const _userId = new ObjectId(payload.id);
    const _appId = new ObjectId(req.params.appId);
    const _taskId = new ObjectId(req.params.taskId);

    const user = await usersColl.findOne({ _id: _userId });
    if (!user) {
      logger.warn('User not found', { userId: _userId });
      return res.status(404).json({ success: false, message: 'User not found', data: null });
    }

    const task = await tasksColl.findOneAndUpdate(
      { _id: _taskId, userId: _userId, appId: _appId },
      { $set: { taskStatus: newStatus } },
      { returnDocument: 'after' }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or not owned by user', data: null });
    }

    logger.info('Task updated successfully', { userId: _userId, email: user.email, appId: _appId, taskId: _taskId, taskName: task.taskName });
    res.status(200).json({ success: true, messageKey: `tasks.update_success`, messageParams: { taskName: task.taskName } });
  } catch (error) {
    logger.error('Error update task', { message: error.message, stack: error.stack });
    return res.status(500).json({ success: false, messageKey: 'tasks.update_error', data: null });
  }
};
