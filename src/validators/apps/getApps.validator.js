import { header } from 'express-validator';

export const getAppsValidator = [
  header('Authorization')
    .notEmpty()
    .withMessage('Token is required')
    .matches(/^Bearer\s.+$/)
    .withMessage('Invalid token format'),
];
