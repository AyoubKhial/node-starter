const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { verify } = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const util = require('util');
const controller = require('api/auth/controller.js');
const service = require('api/auth/service');
const User = require('api/user/model');
const cache = require('config/cache');
const cacheService = require('config/cache/helper');
const config = require('config/env');
const mailerService = require('services/mailer');
const asyncWrapper = require('utils/async-wrapper');
const response = require('utils/response-builder.js');

const routes = [
    {
        path: '/auth/register',
        method: 'POST',
        clearCache: {
            collections: ['User'],
            methods: ['GET'],
            types: ['list'],
            cacheService: cacheService({ util, client: cache().getClient() })
        },
        handler: asyncWrapper(async (req, res, next) => {
            return controller.register({ req, res, next, userModel: User, service, config });
        })
    },
    {
        path: '/auth/login',
        method: 'POST',
        rateLimiter: {
            rateLimit,
            extraOptions: {
                windowMs: 1 * 60 * 1000,
                max: 5
            }
        },
        handler: asyncWrapper(async (req, res, next) => {
            return controller.login({ req, res, next, userModel: User, service, config });
        })
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
        protect: {
            roles: ['USER', 'PUBLISHER', 'ADMIN'],
            config,
            userModel: User,
            verifyToken: verify
        },
        handler: (req, res, next) => {
            return controller.getLoggedInUser({ req, res, next, response });
        }
    },
    {
        path: '/auth/forgot-password',
        method: 'POST',
        handler: asyncWrapper(async (req, res, next) => {
            return controller.forgotPassword({
                req,
                res,
                next,
                response,
                userModel: User,
                mailerService,
                config,
                externalMailService: nodemailer
            });
        })
    },
    {
        path: '/auth/reset-password/:resetToken',
        method: 'PUT',
        handler: asyncWrapper(async (req, res, next) => {
            return controller.resetPassword({ req, res, next, userModel: User, service, crypto, config });
        })
    }
];

module.exports = routes;
