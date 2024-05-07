"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.privateRouter = void 0;
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PrismaClient_1 = require("../databases/PrismaClient");
const apiErrors_1 = require("../helpers/apiErrors");
dotenv_1.default.config();
const options = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};
passport_1.default.use(new passport_jwt_1.Strategy(options, async (payload, done) => {
    const user = await PrismaClient_1.prismaClient.users.findUnique({ where: { id: payload.id } });
    return user ? done(null, user) : done(new apiErrors_1.UnauthorazedError("Unauthorazed user"), false);
}));
const privateRouter = (req, res, next) => {
    passport_1.default.authenticate("jwt", (_err, user) => {
        const { password: _, ...dataUser } = user;
        req.user = dataUser;
        return user ? next() : next(new apiErrors_1.UnauthorazedError("Unauthorazed user"));
    })(req, res, next);
};
exports.privateRouter = privateRouter;
const generateToken = (data) => {
    return jsonwebtoken_1.default.sign({ id: data }, process.env.JWT_SECRET, { expiresIn: '1d' });
};
exports.generateToken = generateToken;
exports.default = passport_1.default;
//# sourceMappingURL=PassportMiddleware.js.map