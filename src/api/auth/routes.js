const crypto = require('crypto');
const controller = require('./controller.js');
const service = require('./service');
const User = require('../user/model');
const response = require('../../utils/response-builder.js');
const mailerService = require('../../services/mailer');

const routes = [
    {
        path: '/auth/register',
        method: 'POST',
        clearCache: {
            collections: ['User'],
            methods: ['GET'],
            types: ['list']
        },
        handler: (req, res, next) => {
            return controller.register({ req, res, next, userModel: User, service });
        }
    },
    {
        path: '/auth/login',
        method: 'POST',
        limit: {
            windowMs: 1 * 60 * 1000,
            max: 5
        },
        handler: (req, res, next) => {
            return controller.login({ req, res, next, userModel: User, service });
        }
    },
    {
        path: '/auth/logout',
        method: 'GET',
        handler: (req, res, next) => {
            return controller.logout({ req, res, next, response });
        }
    },
    {
        path: '/auth/me',
        method: 'GET',
        protected: {
            roles: ['USER', 'PUBLISHER', 'ADMIN']
        },
        handler: (req, res, next) => {
            return controller.getLoggedInUser({ req, res, next, response });
        }
    },
    {
        path: '/auth/forgot-password',
        method: 'POST',
        handler: async (req, res, next) => {
            return controller.forgotPassword({ req, res, next, response, userModel: User, mailerService });
        }
    },
    {
        path: '/auth/reset-password/:resetToken',
        method: 'PUT',
        handler: (req, res, next) => {
            return controller.resetPassword({ req, res, next, userModel: User, service, crypto });
        }
    }
];

module.exports = routes;
