import bcryptjs from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config/env/index.js';

const { compare, genSalt, hash } = bcryptjs;
const { sign } = jsonwebtoken;
const { model, Schema } = mongoose;

const schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name.'],
            trim: true
        },
        username: {
            type: String,
            required: [true, 'Please add a username.'],
            unique: true,
            trim: true,
            maxlength: [20, 'username can not be more than 20 characters']
        },
        email: {
            type: String,
            required: [true, 'Please add an email.'],
            unique: true,
            trim: true,
            validate: {
                // we can use 'this' keyword to refer to current document like 'this.name'
                // 'this' keyword works only in save
                validator(v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: 'Please enter a valid email'
            }
        },
        role: {
            type: String,
            enum: ['ADMIN', 'PUBLISHER', 'USER'],
            default: 'USER'
        },
        password: {
            type: String,
            required: [true, 'Please add a password.'],
            minlength: [6, 'password should be at least 6 characters'],
            select: false
        },
        gender: {
            type: String,
            enum: ['M', 'F']
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpire: {
            type: Date
        }
    },
    { timestamps: true }
);

schema.pre('save', async function (next) {
    if (!this.isModified('password')) next();
    const salt = await genSalt();
    this.password = await hash(this.password, salt);
});

schema.methods.getSignedJwtToken = function () {
    return sign({ id: this._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

schema.methods.matchPassword = async function (enteredPassword) {
    return compare(enteredPassword, this.password);
};

schema.methods.getResetPasswordToken = function () {
    const resetToken = randomBytes(20).toString('hex');
    this.resetPasswordToken = createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

export default model('User', schema);
