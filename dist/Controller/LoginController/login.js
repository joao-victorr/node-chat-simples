"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const apiErrors_1 = require("../../helpers/apiErrors");
const PrismaClient_1 = require("../../databases/PrismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const PassportMiddleware_1 = require("../../middleware/PassportMiddleware");
class LoginController {
    async login(req, res) {
        console.log(req.body);
        const loginData = req.body;
        if (!loginData.email || !loginData.password) {
            new apiErrors_1.BadResquestError("Data not found");
        }
        const data = await PrismaClient_1.prismaClient.users.findUnique({ where: { email: loginData.email } });
        if (!data) {
            throw new apiErrors_1.UnauthorazedError("Email or password not found");
        }
        const varifyPassword = await bcrypt_1.default.compare(loginData.password, data.password);
        if (!varifyPassword) {
            throw new apiErrors_1.UnauthorazedError("Email or password incorrect");
        }
        const { password: _, ...user } = data;
        const token = (0, PassportMiddleware_1.generateToken)(user.id);
        return res.status(200).json({ user, token: token });
    }
}
exports.LoginController = LoginController;
//# sourceMappingURL=login.js.map