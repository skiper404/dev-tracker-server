import { Router } from 'express';
import { createApp } from '../controllers/apps/createApp.js';
import { getApps } from '../controllers/apps/getApps.js';
import { removeApp } from '../controllers/apps/removeApp.js';
import { updateApp } from '../controllers/apps/updateApp.js';
import { getAppsValidator } from '../validators/apps/getApps.validator.js';
import { createAppValidator } from '../validators/apps/createApp.validator.js';
import { updateAppValidator } from '../validators/apps/updateApp.validator.js';
import { removeAppValidator } from '../validators/apps/removeApp.validator.js';
import { validate } from '../middlewares/validate.js';

export const appRouter = Router();

appRouter.get('/apps', getAppsValidator, validate, getApps);
appRouter.post('/app', createAppValidator, validate, createApp);
appRouter.put('/app/:id', updateAppValidator, validate, updateApp);
appRouter.delete('/app/:id', removeAppValidator, validate, removeApp);
