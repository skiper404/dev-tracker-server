import { header } from 'express-validator';

export const removeTaskValidator = [
  header('Authorization')
    .notEmpty()
    .withMessage('Token is required')
    .matches(/^Bearer\s.+$/)
    .withMessage('Invalid token format'),
];
