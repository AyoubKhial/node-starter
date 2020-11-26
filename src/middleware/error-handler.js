const Response = require('../utils/response-builder.js');

const errorHandler = (err, req, res, next) => {
    const message = 'Server error.';
    const code = 500;
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
        err.code = 400;
    }

    return Response.build(res, { success: false, error: err.message || message }, err.code || code);
};

module.exports = errorHandler;
