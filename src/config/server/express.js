const cookieParser = require('cookie-parser');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const fs = require('fs');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const path = require('path');
const xss = require('xss-clean');
const logger = require('config/logger');
const modules = require('config/server/modules.js');
const errorHandler = require('middleware/error-handler.js');
const to = require('utils/await-to.js');
const helpers = require('utils/helpers');
const Response = require('utils/response-builder.js');

const createExpressApp = async () => {
    const app = express();

    app.use(express.json({ limit: '10kb' }));
    app.use(cookieParser());
    app.use(mongoSanitize());
    app.use(helmet());
    app.use(hpp());
    app.use(xss());
    app.use(morgan('dev', { stream: logger.stream }));

    const router = express.Router();
    const modulesPaths = helpers.getPathsList(modules);
    const importsPromises = modulesPaths.map(modulePath => {
        const basePath = `../../api/${modulePath}`;
        return {
            module: require(basePath),
            routes: require(`${basePath}/routes`)
        };
    });
    const [error, importedModules] = await to(Promise.all(importsPromises));
    if (error) logger.error(error);
    else {
        const middlewareList = helpers.getMiddlewareList({ fs, path });
        for (const importedModule of importedModules) {
            const routes = importedModule.module({
                binder: require('utils/helpers').getRoutesWithMiddleware,
                routes: importedModule.routes,
                middlewareList
            });
            for (const route of routes) {
                router[route.method](...route.args);
            }
        }
    }

    app.use('/api', router);
    app.all('*', (req, res, next) => {
        next({ message: `Can't find ${req.originalUrl} on this server!`, code: 404 });
    });
    app.use(errorHandler({ responseBuilder: Response.build }));

    return app;
};

module.exports = createExpressApp();
