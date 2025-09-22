import { Router } from 'express';
import { authRouter } from './auth.router.js';
import { userRouter } from './user.router.js';
import { appRouter } from './app.router.js';
import { taskRouter } from './task.router.js';

export const router = Router();

router.use(authRouter);
router.use(userRouter);
router.use(appRouter);
router.use(taskRouter);
