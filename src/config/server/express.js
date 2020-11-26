const cookieParser = require('cookie-parser');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const fs = require('fs');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const path = require('path');
const xss = require('xss-clean');
const errorHandler = require('../../middleware/error-handler.js');
const getPathsList = require('./helpers.js');
const logger = require('../logger');
const modules = require('./modules.js');
const to = require('../../utils/await-to.js');
const helpers = require('../../utils/helpers');

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
    const modulesPaths = getPathsList(modules);
    const imports = modulesPaths.map(modulePath => {
        return {
            module: require(`../../api/${modulePath}`),
            routes: require(`../../api/${modulePath}/routes`)
        };
    });

    const [error, importedModules] = await to(Promise.all(imports));
    if (error) logger.error(error);
    else {
        importedModules.forEach(module => {
            return module.module({
                app: router,
                binder: require('../../utils/http-binder'),
                routes: module.routes,
                middleware: helpers.getMiddleware({ fs, path })
            });
        });
    }

    app.use('/api', router);
    app.all('*', (req, res, next) => {
        next({ message: `Can't find ${req.originalUrl} on this server!`, code: 404 });
    });
    app.use(errorHandler);

    return app;
};

module.exports = createExpressApp();
