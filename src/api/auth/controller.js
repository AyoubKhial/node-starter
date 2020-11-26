const { createHash } = require('crypto');
const asyncWrapper = require('../../utils/async-wrapper.js');
const ErrorResponse = require('../../utils/error-response.js');
const response = require('../../utils/response-builder.js');
const sendMail = require('../../services/mailer.js');
const sendTokenResponse = require('./service.js');
const User = require('../user/model');

const register = asyncWrapper(async (req, res, next) => {
    const userData = req.body;
    const user = await User.create(userData);
    return sendTokenResponse(user, 201, res);
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorResponse('Please provide an email and password', 400));
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid credentials', 401));
    const isMatched = await user.matchPassword(password);
    if (!isMatched) return next(new ErrorResponse('Invalid credentials', 401));
    return sendTokenResponse(user, 200, res);
});

const logout = asyncWrapper(async (req, res, next) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000) });
    return response.build(res, { success: true }, 200);
});

const getLoggedInUser = (req, res, next) => {
    const user = req.user;
    return response.build(res, { success: true, user }, 200);
};

const forgotPassword = asyncWrapper(async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorResponse('There is no user with that email', 404));
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `Please make a put request to: \n\n${resetUrl}`;
    try {
        await sendMail({ email: user.email, subject: 'Reset password', message });
        return response.build(res, { success: true, data: 'Email sent successfully.' }, 200);
    } catch {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorResponse('Email could not be sent.', 500));
    }
});

const resetPassword = asyncWrapper(async (req, res, next) => {
    const resetToken = req.params.resetToken;
    const password = req.body.password;
    const resetPasswordToken = createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return next(new ErrorResponse('Invalid Token.', 400));
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return sendTokenResponse(user, 200, res);
});

module.exports = { register, login, logout, getLoggedInUser, forgotPassword, resetPassword };
