const asyncWrapper = require('utils/async-wrapper.js');

const register = asyncWrapper(async ({ req, res, next, userModel, service, config }) => {
    const userData = req.body;
    const user = await userModel.create(userData);
    return service.sendTokenResponse({ user, statusCode: 201, res, config });
});

const login = asyncWrapper(async ({ req, res, next, userModel, service, config }) => {
    const { email, password } = req.body;
    if (!email || !password) return next({ message: 'Please provide an email and password.', code: 400 });
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) return next({ message: 'Invalid credentials.', code: 401 });
    const isMatched = await user.matchPassword(password);
    if (!isMatched) return next({ message: 'Invalid credentials.', code: 401 });
    return service.sendTokenResponse({ user, statusCode: 200, res, config });
});

const logout = ({ req, res, next, response }) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000) });
    return response.build(res, { success: true }, 200);
};

const getLoggedInUser = ({ req, res, next, response }) => {
    const user = req.user;
    return response.build(res, { success: true, user }, 200);
};

const forgotPassword = asyncWrapper(async ({ req, res, next, response, userModel, mailerService, externalMailService, config }) => {
    const email = req.body.email;
    if (!email) return next({ message: 'Please provide an email.', code: 400 });
    const user = await userModel.findOne({ email });
    if (!user) return next({ message: `There is no user with '${email}' email.`, code: 404 });
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `Please make a put request to: \n\n${resetUrl}`;
    try {
        await mailerService.sendMail({ options: { email: user.email, subject: 'Reset password', message }, config, service: externalMailService });
        return response.build(res, { success: true, data: 'Email sent successfully.' }, 200);
    } catch {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next({ message: 'Email could not be sent.', code: 500 });
    }
});

const resetPassword = asyncWrapper(async ({ req, res, next, userModel, service, crypto, config }) => {
    const resetToken = req.params.resetToken;
    if (!resetToken) return next({ message: 'Please provide the reset token.', code: 400 });
    const password = req.body.password;
    if (!password) return next({ message: 'Please provide the new password.', code: 400 });
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await userModel.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
    if (!user) return next({ message: 'Invalid Token.', code: 401 });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return service.sendTokenResponse({ user, statusCode: 200, res, config });
});

module.exports = { register, login, logout, getLoggedInUser, forgotPassword, resetPassword };
