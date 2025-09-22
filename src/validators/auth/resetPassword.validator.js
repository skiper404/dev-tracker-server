import { body } from 'express-validator';

export const resetPasswordValidator = [
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 1 }).withMessage('Password must be at least 1 characters'),
];
