import * as controller from './controller';

const routes = [
    {
        path: '/users',
        method: 'GET',
        handler: async (req, res, next) => {
            controller.find(req, res, next);
        }
    },
    {
        path: '/users/:id',
        method: 'GET',
        handler: async (req, res, next) => {
            controller.findById(req, res, next);
        }
    }
];

export default routes;
