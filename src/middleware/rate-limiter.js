const rateLimit = require('express-rate-limit');

const options = {
    message: {
        success: false
    },
    statusCode: 429
};

const rateLimiter = extraOptions => {
    const minutes = extraOptions.windowMs / 1000 / 60;
    options.message.error = `You have exceeded the ${extraOptions.max} requests in ${minutes} minutes limit!`;
    return rateLimit({ ...options, ...extraOptions });
};

module.exports = rateLimiter;
