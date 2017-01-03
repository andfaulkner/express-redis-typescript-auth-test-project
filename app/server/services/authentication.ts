import { inspect } from 'util';

import * as jsonwebtoken from 'jsonwebtoken';
import * as crypto from 'crypto';

import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import { UserModel } from '../models/user-model';
import { config } from '../../../config/config';

/******************************************** LOGGING *********************************************/
import { buildFileTag } from 'mad-logs';
import * as colors from 'colors';

const TAG = buildFileTag('authentication.ts', colors.bgWhite.black);

/**************************************** AUTH STRATEGIES *****************************************/
/**
 * Create local login strategy
 *
 * TODO create real local login strategy: this must be promisified, hashed, & shouldn't be 'local'
 */
const localLogin = new LocalStrategy({}, async function(username, password, next) {
    try {
        const user = await UserModel.findOne({ username });
        const isMatch = await user.comparePassword(password);
        next(null, user)
    } catch(e) {
        e.message = e.message + `\n ${TAG} localLogin failed: login details couldn't be verified`;
        return next(e);
    }
});

/**
 * Set up options to be used with JSON Web Token authentication strategy
 */
const jwtOptions = {
    // check authorization headers for JWT
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.auth.token.secret,
};

/**
 * Create JSON Web Token (JWT) authentication strategy.
 * Searches all users for the given username, then returns all user data
 */
const jwtLogin = new JwtStrategy(jwtOptions, async function(payload, done) {
    console.log('auth-route: jwtStrategy:: payload:: ', inspect(payload, true, 10, true));

    try {
        const user = UserModel.findOne({ username: payload.username });
        return done(null, user);
    } catch(e) {
        console.error(`${TAG}: jwtLogin: Error: `, e.summary);
        return done(e);
    }

    // TODO set finding username by id up
    // UserModel.findById(payload._id, function(err: Error | null, user: UserModel) {
    //     if (err) { return done(err, false); }
    //     if (user) { return done(null, user); }
    //     return done(null, false);
    // });
});

/*********************************** GLUE STRATEGY TO PASSPORT ************************************/
passport.use(jwtLogin);  
passport.use(localLogin);

/******************************************** HELPERS *********************************************/
/**
 * Generate a JSON web token from the user object passed in
 */
export function generateToken(user) {
    return jsonwebtoken.sign(user, config.auth.token.secret, {
        expiresIn: 1000,
    });
}

/**
 * Selects user info we want to pass into the JSON web token (from the request object)
 */
export function setUserInfo(request) {
    return {
        _id: request._id,
        firstName: request.profile.firstName,
        lastName: request.profile.lastName,
        email: request.email,
        role: request.role,
    }
}

export { passport as passportWJwtAndLocal }
