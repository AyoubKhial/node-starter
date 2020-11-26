const Response = require('../utils/response-builder.js');

const errorHandler = (err, req, res, next) => {
    // Mongoose bad ObjectID
    if (err.name === 'CastError') {
        err.message = 'Resource not found.';
        err.code = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        err.message = 'Duplicate field value entered.';
        err.code = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        err.message = Object.values(err.errors).map(error => error.message);
        code = 400;
    }

    return Response.build(res, { success: false, error: err.message || message }, err.code || code);
};

module.exports = errorHandler;
