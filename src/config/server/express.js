const cookieParser = require('cookie-parser');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const xss = require('xss-clean');
const errorHandler = require('../../middleware/error-handler.js');
const getPathsList = require('./helpers.js');
const logger = require('../logger');
const modules = require('./modules.js');
const to = require('../../utils/await-to.js');

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
const imports = modulesPaths.map(modulePath => require(`../../api/${modulePath}`));
(async () => {
    const [error, importedModules] = await to(Promise.all(imports));
    if (error) logger.error(error);
    else importedModules.forEach(module => module(router));
})();

app.use('/api', router);
app.all('*', (req, res, next) => {
    next({ message: `Can't find ${req.originalUrl} on this server!`, code: 404 });
});
app.use(errorHandler);

module.exports = app;
