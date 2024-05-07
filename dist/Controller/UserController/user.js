"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const apiErrors_1 = require("../../helpers/apiErrors");
const PrismaClient_1 = require("../../databases/PrismaClient");
class UserController {
    async create(req, res) {
        const userData = req.body;
        if (!userData.email || !userData.name || !userData.password) {
            new apiErrors_1.BadResquestError("Data not found");
        }
        const passwordHash = await bcrypt_1.default.hash(userData.password, 10);
        const newUser = await PrismaClient_1.prismaClient.users.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: passwordHash
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });
        return res.status(201).json({ data: newUser });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.js.map