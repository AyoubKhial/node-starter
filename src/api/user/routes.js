const controller = require('./controller.js');
const User = require('./model');
const response = require('../../utils/response-builder.js');

const routes = [
    {
        path: '/users',
        method: 'GET',
        protected: {
            roles: ['ADMIN']
        },
        advancedResult: {
            model: User
        },
        cachedResult: {
            collection: 'User',
            method: 'GET',
            type: 'list',
            keys: ['page', 'size', 'sort', 'expand', 'fields'],
            source: 'query'
        },
        handler: async (req, res, next) => {
            controller.find({ req, res, next, response });
        }
    },
    {
        path: '/users/:id',
        method: 'GET',
        protected: {
            roles: ['ADMIN']
        },
        handler: async (req, res, next) => {
            controller.findById({ req, res, next, response, userModel: User });
        }
    },
    {
        path: '/users/:id',
        method: 'PUT',
        handler: async (req, res, next) => {
            controller.updateById({ req, res, next, response, userModel: User });
        }
    },
    {
        path: '/users/:id',
        method: 'DELETE',
        handler: async (req, res, next) => {
            controller.deleteById({ req, res, next, response, userModel: User });
        }
    }
];

module.exports = routes;
