import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import User from '../../../domain/entity/User';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret',
};

passport.use(
  new JwtStrategy(jwtOptions, (payload, done) => {
    return done(null, payload);
  }),
);

export const authMiddleware = passport.authenticate('jwt', { session: false });

export interface AuthRequest extends Request {
  user: User;
}
