const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('../env-vars');
const errorHandler = require('../../middleware/error-handler');
const ErrorResponse = require('../../utils/error-response');
const getPathsList = require('./helpers');
const logger = require('../logger');
const modules = require('./modules');
const terminate = require('./terminate');
const to = require('../../utils/await-to');

const app = express();

const start = async () => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan('dev', { stream: logger.stream }));

    const router = express.Router();

    const modulesPaths = getPathsList(modules);
    const imports = modulesPaths.map(modulePath => require(`../../api/${modulePath}`));

    const [error, importedModules] = await to(Promise.all(imports));
    if (error) logger.error(error);
    else importedModules.forEach(module => module(router));

    app.use('/api', router);
    app.all('*', (req, res, next) => {
        next(new ErrorResponse(`Can't find ${req.originalUrl} on this server!`, 404));
    });
    app.use(errorHandler);

    const server = app.listen(config.NODE_PORT, () => {
        logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.NODE_PORT}...`);
    });

    const exitHandler = terminate(server, { coredump: false, timeout: 500 });

    process.on('uncaughtException', exitHandler());
    process.on('unhandledRejection', exitHandler());
    process.on('SIGTERM', exitHandler());
    process.on('SIGINT', exitHandler());
};

module.exports = { start };
