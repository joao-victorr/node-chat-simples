import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { prismaClient } from '../databases/PrismaClient';
import { UnauthorazedError } from '../helpers/apiErrors';

dotenv.config();

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET as string
}

passport.use(new JWTStrategy(options, async (payload, done) => {
    const user = await prismaClient.users.findUnique({where: {id: payload.id}})
    return user ? done(null, user) : done(new UnauthorazedError("Unauthorazed user"), false);
}))

export const privateRouter = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("jwt", (_err: Error, user: any) => {
        const { password: _, ...dataUser } = user
        req.user = dataUser;
        return user ? next() : next(new UnauthorazedError("Unauthorazed user"));
    })(req, res, next);
};

export const generateToken = (data: Object) => {
    return jwt.sign({id: data}, process.env.JWT_SECRET as string, { expiresIn: '1d' })
}


export default passport;