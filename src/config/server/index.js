import express from 'express';
import morgan from 'morgan';
import config from '../env-vars';
import logger from '../logger';
import terminate from './terminate';

const app = express();

const start = () => {
    app.use(morgan('dev', { stream: logger.stream }));
    // This is a simple test route
    app.get('/', (req, res) => {
        try {
            JSON.parse('{ "a": "b }');
        } catch (error) {
            logger.error(`500 - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        }
        res.send('Hello world');
    });

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
