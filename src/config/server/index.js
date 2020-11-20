import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import config from '../env/index.js';
import errorHandler from '../../middleware/error-handler.js';
import ErrorResponse from '../../utils/error-response.js';
import getPathsList from './helpers.js';
import logger from '../logger/index.js';
import modules from './modules.js';
import terminate from './terminate.js';
import to from '../../utils/await-to.js';

const app = express();

const start = async () => {
    app.use(express.json());
    app.use(cookieParser());
    app.use(helmet());
    app.use(hpp());
    app.use(morgan('dev', { stream: logger.stream }));

    const router = express.Router();

    const modulesPaths = getPathsList(modules);
    const imports = modulesPaths.map(modulePath => import(`../../api/${modulePath}/index.js`));

    const [error, importedModules] = await to(Promise.all(imports));
    if (error) logger.error(error);
    else importedModules.forEach(module => module.default(router));

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

export default { start };
