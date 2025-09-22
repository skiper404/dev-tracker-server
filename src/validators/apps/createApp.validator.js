import { body, header } from 'express-validator';

export const createAppValidator = [
  header('Authorization')
    .notEmpty()
    .withMessage('Token is required')
    .matches(/^Bearer\s.+$/)
    .withMessage('Invalid token format'),
  body('appName').trim().notEmpty().withMessage('App name is required').isLength({ min: 3 }).withMessage('App name must be at least 3 characters'),
  body('appType').isIn(['desktop', 'mobile', 'web']).withMessage('Invalid app type').notEmpty().withMessage('App type is required'),
];
