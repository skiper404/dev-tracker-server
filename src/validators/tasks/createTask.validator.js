import { body, header } from 'express-validator';

export const createTaskValidator = [
  header('Authorization')
    .notEmpty()
    .withMessage('Token is required')
    .matches(/^Bearer\s.+$/)
    .withMessage('Invalid token format'),
  body('taskName').trim().notEmpty().withMessage('Task name is required').isLength({ min: 3 }).withMessage('Task name must be at least 3 characters'),
  body('taskCategory').notEmpty().withMessage('Task category is required'),
  body('taskPriority').notEmpty().withMessage('Task priority is required'),
  body('taskStatus').notEmpty().withMessage('Task status is required'),
];
