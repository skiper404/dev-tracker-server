import { body } from 'express-validator';

export const loginUserValidator = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email'),
  body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 1 }).withMessage('Password must be at least 1 characters'),
];
