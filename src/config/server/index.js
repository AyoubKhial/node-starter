import express from 'express';
import morgan from 'morgan';
import config from '../env-vars';
import terminate from './terminate';

const app = express();

const start = () => {
    if (config.ENV !== 'production') {
        app.use(morgan('dev'));
    }
    // This is a simple test route
    app.get('/', (req, res) => {
        res.send('Hello world');
    });

    const server = app.listen(config.PORT, () => {
        console.log(`Server running in ${config.ENV} mode on port ${config.PORT}...`);
    });

    const exitHandler = terminate(server, { coredump: false, timeout: 500 });

    process.on('uncaughtException', exitHandler());
    process.on('unhandledRejection', exitHandler());
    process.on('SIGTERM', exitHandler());
    process.on('SIGINT', exitHandler());
};

export default { start };
