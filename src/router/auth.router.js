import { Router } from 'express';
import { createUser } from '../controllers/auth/createUser.js';
import { loginUser } from '../controllers/auth/loginUser.js';
import { forgotPassword } from '../controllers/auth/forgotPassword.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';

import { createUserValidator } from '../validators/auth/createUser.validator.js';
import { loginUserValidator } from '../validators/auth/loginUser.validator.js';
import { forgotPasswordValidator } from '../validators/auth/forgotPassword.validator.js';
import { resetPasswordValidator } from '../validators/auth/resetPassword.validator.js';
import { validate } from '../middlewares/validate.js';

export const authRouter = new Router();

authRouter.post('/register', createUserValidator, validate, createUser);
authRouter.post('/login', loginUserValidator, validate, loginUser);
authRouter.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
authRouter.post('/reset-password', resetPasswordValidator, validate, resetPassword);
