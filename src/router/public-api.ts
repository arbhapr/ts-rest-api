import express from 'express';
import { UserController } from '../controller/user-controller';

export const publicRouter = express.Router();

// User API
publicRouter.post('/api/users', UserController.register);
publicRouter.post('/api/users/login', UserController.login);