import { body, header } from 'express-validator';

export const updateTaskStatusValidator = [
  header('Authorization')
    .notEmpty()
    .withMessage('Token is required')
    .matches(/^Bearer\s.+$/)
    .withMessage('Invalid token format'),
  body('status').notEmpty().withMessage('Task status is required'),
];
