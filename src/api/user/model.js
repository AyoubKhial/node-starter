import { genSalt, hash } from 'bcryptjs';
import { model, Schema } from 'mongoose';

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

export default model('User', schema);
