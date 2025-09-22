import { Router } from 'express';
import { validate } from '../middlewares/validate.js';
import { updateUser } from '../controllers/user/updateUser.js';
import { getUser } from '../controllers/user/getUser.js';
import { getUserValidator } from '../validators/user/getUser.validator.js';

export const userRouter = new Router();

userRouter.get('/user', getUserValidator, validate, getUser);
userRouter.put('/user', updateUser);
