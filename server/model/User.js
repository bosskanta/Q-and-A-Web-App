import * as mongooseDef from 'mongoose'
import { validatorEmail } from '../util/util.js'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'
import { jwtSecret } from '../config/jwtConfig.js'

let mongoose = mongooseDef.default;

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
        type: String, required: true,
        validate: {
            validator: validatorEmail,
            message: props => `${props.value} is not a valid email!`
        },
        unique: [true, 'must be uniqued'],
        required: [true, 'email is required']
    },
    password: {
        type: String, required: true,
        minlength: [40], // bcrypt hash binary size is 40+
    }
})

// *** Important note ***
// methods in schema must be defined in a function format
// not in big arrow form in order to get a correct "this" property
userSchema.methods.validPassword = function (txtPassword) {
    return bcrypt.compareSync(txtPassword, this.password);
}

userSchema.methods.generateJWT = function () {
    const expiresIn = 7200; // 2 hours
    return {
        token: jsonwebtoken.sign({
            _id: this._id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email
        }, jwtSecret, { expiresIn }),
        expiresIn: expiresIn
    }
}

// After signin
userSchema.methods.toAuthJSON = function () {
    let genJWT = this.generateJWT();
    return {
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        token: "bearer " + genJWT.token,
        expiresIn: genJWT.expiresIn,
    };
};

let User = mongoose.model('User', userSchema, 'users');
export default User;