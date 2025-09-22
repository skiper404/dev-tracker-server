import { body } from 'express-validator';

export const forgotPasswordValidator = [body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email')];
