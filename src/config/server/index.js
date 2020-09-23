import express from 'express';
import morgan from 'morgan';
import config from '../env-vars';
import getPathsList from './helpers';
import logger from '../logger';
import modules from './modules';
import terminate from './terminate';
import to from '../../utils/await-to';

const app = express();

const start = async () => {
    app.use(morgan('dev', { stream: logger.stream }));

    const router = express.Router();

    const modulesPaths = getPathsList(modules);
    const imports = modulesPaths.map(modulePath => import(`../../api/${modulePath}`));

    const [error, importedModules] = await to(Promise.all(imports));
    if (error) logger.error(error.message);
    else importedModules.forEach(module => module.default(router));

    app.use('/api', router);

    const server = app.listen(config.NODE_PORT, () => {
        logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.NODE_PORT}...`);
    });

    const exitHandler = terminate(server, { coredump: false, timeout: 500 });

    process.on('uncaughtException', exitHandler());
    process.on('unhandledRejection', exitHandler());
    process.on('SIGTERM', exitHandler());
    process.on('SIGINT', exitHandler());
};

export default { start };
