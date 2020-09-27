import * as controller from './controller';
import User from './model';

const routes = [
    {
        path: '/users',
        method: 'GET',
        advancedResult: {
            model: User
        },
        protected: {
            roles: ['ADMIN']
        },
        handler: async (req, res, next) => {
            controller.find(req, res, next);
        }
    },
    {
        path: '/users/:id',
        method: 'GET',
        protected: {
            roles: ['ADMIN']
        },
        handler: async (req, res, next) => {
            controller.findById(req, res, next);
        }
    },
    {
        path: '/users/:id',
        method: 'PUT',
        handler: async (req, res, next) => {
            controller.updateById(req, res, next);
        }
    },
    {
        path: '/users/:id',
        method: 'DELETE',
        handler: async (req, res, next) => {
            controller.deleteById(req, res, next);
        }
    }
];

export default routes;
