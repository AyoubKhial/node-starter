const jsonwebtoken = require('jsonwebtoken');
const ErrorResponse = require('../utils/error-response.js');
const User = require('../api/user/model');
const config = require('../config/env');

const { verify } = jsonwebtoken;

const protect = roles => async (req, res, next) => {
    let token;
    const authorization = req?.headers?.authorization;
    if (authorization && authorization.startsWith('Bearer')) token = authorization.split(' ')[1];
    else if (req?.cookies?.token) token = req?.cookies?.token;
    if (!token) next(new ErrorResponse('Not authorized to access this route', 401));
    try {
        const decoded = verify(token, config.jwt.secret);
        req.user = await User.findById(decoded.id);
        if (!roles.includes(req?.user?.role)) {
            next(new ErrorResponse(`User with role '${req?.user?.role}' is not authorized to access this route.`, 403));
        }
        next();
    } catch (err) {
        next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

module.exports = protect;
