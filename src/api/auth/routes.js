const controller = require('./controller.js');

const routes = [
    {
        path: '/auth/register',
        method: 'POST',
        clearCache: {
            collections: ['User'],
            methods: ['GET'],
            types: ['list']
        },
        handler: async (req, res, next) => {
            controller.register(req, res, next);
        }
    },
    {
        path: '/auth/login',
        method: 'POST',
        limit: {
            windowMs: 1 * 60 * 1000,
            max: 5
        },
        handler: async (req, res, next) => {
            controller.login(req, res, next);
        }
    },
    {
        path: '/auth/logout',
        method: 'GET',
        handler: async (req, res, next) => {
            controller.logout(req, res, next);
        }
    },
    {
        path: '/auth/me',
        method: 'GET',
        protected: {
            roles: ['USER', 'PUBLISHER', 'ADMIN']
        },
        handler: async (req, res, next) => {
            controller.getLoggedInUser(req, res, next);
        }
    },
    {
        path: '/auth/forgot-password',
        method: 'POST',
        handler: async (req, res, next) => {
            controller.forgotPassword(req, res, next);
        }
    },
    {
        path: '/auth/reset-password/:resetToken',
        method: 'PUT',
        handler: async (req, res, next) => {
            controller.resetPassword(req, res, next);
        }
    }
];

module.exports = routes;
