const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const xss = require('xss-clean');
const config = require('../env');
const errorHandler = require('../../middleware/error-handler.js');
const ErrorResponse = require('../../utils/error-response.js');
const getPathsList = require('./helpers.js');
const logger = require('../logger');
const modules = require('./modules.js');
const terminate = require('./terminate.js');
const to = require('../../utils/await-to.js');

const app = express();

const start = async () => {
    app.use(express.json({ limit: '10kb' }));
    app.use(cookieParser());
    app.use(mongoSanitize());
    app.use(helmet());
    app.use(hpp());
    app.use(xss());
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

    const server = app.listen(config.node.port, () => {
        logger.info(`Server running in ${config.node.env} mode on port ${config.node.port}...`);
    });

    const exitHandler = terminate(server, { coredump: false, timeout: 500 });

    process.on('uncaughtException', exitHandler());
    process.on('unhandledRejection', exitHandler());
    process.on('SIGTERM', exitHandler());
    process.on('SIGINT', exitHandler());
};

module.exports = { start, app };
