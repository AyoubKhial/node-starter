const ErrorResponse = require('../utils/error-response');
const Response = require('../utils/response-builder');

const errorHandler = (err, req, res, next) => {
    // Mongoose bad ObjectID
    if (err.name === 'CastError') {
        const message = 'Resource not found.';
        err = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered.';
        err = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(error => error.message);
        err = new ErrorResponse(message, 400);
    }

    Response.build(res, { success: false, error: err.message || 'Server Error.' }, err.statusCode || 500);
};

module.exports = errorHandler;
