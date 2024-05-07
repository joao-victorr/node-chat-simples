"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("./Controller/LoginController/login");
const user_1 = require("./Controller/UserController/user");
const loginController = new login_1.LoginController();
const userController = new user_1.UserController();
const router = (0, express_1.Router)();
router.post('/login', loginController.login);
router.post('/user', userController.create);
exports.default = router;
//# sourceMappingURL=router.js.map