import passport from "passport";
import passportJWT from 'passport-jwt';

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

import userModel from '../model/User.js';
import { jwtSecret } from '../config/jwtConfig.js';
import { logError } from "./util.js";

export const jwtPassport = () => {
    let params = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("bearer"),
        secretOrKey: jwtSecret, // 'love-bacon'
    }
    var strategy = new JwtStrategy(params, (jwt_payload, done) => {
        userModel.findOne({ email: jwt_payload.email })
            .then(user => {
                if (user) { return done(null, user); }
                return done(null, false, "Invalid User");
            })
            .catch(err => { return done(err, false, { message: "Invalid Token Credential" }); })
    });
    passport.use(strategy); // make passport use a specified strategy
    return {
        initialize: () => passport.initialize(),
        authenticate: (withSession = false) =>
            passport.authenticate('jwt', { session: withSession }) // false: disable passport persistent session
    }
};

// role must use the ROLES.<name>, ROLE here is a number (1,2)
export const isInRole = (role) => (req, res, next) => {
    if (!req.user)
        return res.status(404).json(logError("Need to signin"))

    if (role === ROLES.admin && req.user.role === "user" && req.user._id.equals(req.params.userId))
        req.user.role = "admin";

    const hasRole = role <= ROLES[req.user.role];
    if (hasRole)
        return next();

    return res.status(404).json(logError(`Required ${ROLES.name(role)} authorization`))
}