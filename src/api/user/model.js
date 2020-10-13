const { compare, genSalt, hash } = require('bcryptjs');
const { createHash, randomBytes } = require('crypto');
const { sign } = require('jsonwebtoken');
const { model, Schema } = require('mongoose');

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
    return sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
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

module.exports = model('User', schema);
