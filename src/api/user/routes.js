const controller = require('api/user/controller.js');
const User = require('api/user/model');
const response = require('utils/response-builder.js');
const config = require('config/env');
const cacheService = require('config/cache/helper');
const util = require('util');
const cache = require('config/cache');
const { verify } = require('jsonwebtoken');

const routes = [
    {
        path: '/users',
        method: 'GET',
        protect: {
            roles: ['ADMIN'],
            config,
            userModel: User,
            verifyToken: verify
        },
        advancedResult: {
            model: User,
            cacheService: cacheService({ util, client: cache().getClient() })
        },
        cachedResult: {
            collection: 'User',
            method: 'GET',
            type: 'list',
            keys: ['page', 'size', 'sort', 'expand', 'fields'],
            source: 'query',
            cacheService: cacheService({ util, client: cache().getClient() })
        },
        handler: async (req, res, next) => {
            controller.find({ req, res, next, response });
        }
    },
    {
        path: '/users/:id',
        method: 'GET',
        protect: {
            roles: ['ADMIN'],
            config,
            userModel: User,
            verifyToken: verify
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
