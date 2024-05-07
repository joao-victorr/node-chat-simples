import { Request, Response, Router } from 'express';

import { privateRouter } from './middleware/PassportMiddleware'

import { LoginController } from './Controller/LoginController/login';
import { UserController } from './Controller/UserController/user';

const loginController = new LoginController();
const userController = new UserController();


const router = Router();

router.post('/login', loginController.login);

router.post('/user', userController.create);

export default router;