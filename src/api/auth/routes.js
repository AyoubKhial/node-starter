import * as controller from './controller';

const routes = [
    {
        path: '/auth/register',
        method: 'POST',
        handler: async (req, res, next) => {
            controller.register(req, res, next);
        }
    },
    {
        path: '/auth/login',
        method: 'POST',
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
    }
];

export default routes;
