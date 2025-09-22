import { Router } from 'express';
import { getTasks } from '../controllers/tasks/getTasks.js';
import { createTask } from '../controllers/tasks/createTask.js';
import { removeTask } from '../controllers/tasks/removeTask.js';
import { updateTask } from '../controllers/tasks/updateTask.js';
import { getTasksValidator } from '../validators/tasks/getTasks.validator.js';
import { createTaskValidator } from '../validators/tasks/createTask.validator.js';
import { updateTaskValidator } from '../validators/tasks/updateTask.validator.js';
import { removeTaskValidator } from '../validators/tasks/removeTask.validator.js';
import { updateTaskStatus } from '../controllers/tasks/updateTaskStatus.js';
import { updateTaskStatusValidator } from '../validators/tasks/updateTaskStatus.validator.js';
import { validate } from '../middlewares/validate.js';

export const taskRouter = Router();

taskRouter.get('/tasks/:appId', getTasksValidator, validate, getTasks);
taskRouter.post('/task/:appId', createTaskValidator, validate, createTask);
taskRouter.put('/task/:appId/:taskId', updateTaskValidator, validate, updateTask);
taskRouter.patch('/task/:appId/:taskId', updateTaskStatusValidator, validate, updateTaskStatus);
taskRouter.delete('/task/:appId/:taskId', removeTaskValidator, validate, removeTask);
