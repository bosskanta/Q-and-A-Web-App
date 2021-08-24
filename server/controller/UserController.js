import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { isBlank, logError, validatorEmail } from '../util/util.js';
import { jwtSecret } from '../config/jwtConfig.js';
import User from '../model/User.js'

const usrFieldProjection = {
    __v: false,
    //_id: false,
    password: false,
    signupDate: false,
};

// Create and Save new user to database
export let create = (req, res) => {
    let { firstName, lastName, email, password } = req.body;
    console.log("Creating ", req.body, firstName, lastName, email, password)

    if (!firstName || !lastName || !email || !password)
        return res.status(422).json(logError('Invalid user registration info.'));
    if (!validatorEmail(email))
        return res.status(422).json(logError('Invalid email address.'));

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) 
                return res.status(400).json(logError(err));
            var newUser = new User({
                firstName,
                lastName,
                email,
                password: hash
            })
            // Save User in the database
            User.init()
                .then(function () { // avoid dup by wait until finish building index
                    newUser.save()
                        .then(() => {
                            return res.json({
                                success: true, message: 'Signup completed.',
                                user: newUser.toAuthJSON()
                            });
                        })
                        .catch(err => {
                            return res.status(400).json(logError(err));
                        });
                });
        });
    })
};

// Check signin
export let checkSignin = (req, res) => {
    const { email, password } = req.body;

    // Didn't send email, password through req
    if (!email || !password)
        return res.status(422).json(logError("Required fields"));
    else {
        User.findOne({ email: email })
            .then(user => {
                // Email not found
                if (!user) {
                    return res.status(404).json(logError(err || "Not found email"));
                }
                // Email found
                else {
                    // Valid password
                    if (user.validPassword(password)) {
                        console.log("Signin complete.")
                        return res.json({ user: user.toAuthJSON() })
                    }
                    // Invalid password
                    else {
                        return res.status(401).json(logError("-Invalid credential"))
                    };
                }
            })
            .catch(err => res.status(401).json(logError(err)))
    }
}

// Validate jwt
export const validateToken = (req, res) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = (authHeader.split(' ')[1]).trim();
        try {
            var decode = jsonwebtoken.verify(token, jwtSecret);
            return res.json(decode);
        } catch (err) {
            return res.status(422).json(logError(err));
        }
    }
    else
        res.status(404).json(logError("Not found authorized header"));
};