const config = require('../../config/env');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + config.jwt.cookieExpiresIn * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (config.node.env === 'production') options.secure = true;
    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};

module.exports = sendTokenResponse;
