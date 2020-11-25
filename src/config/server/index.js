const app = require('./express');
const config = require('../env');
const logger = require('../logger');
const terminate = require('./terminate.js');

const start = async () => {
    const server = app.listen(config.node.port, () => {
        logger.info(`Server running in ${config.node.env} mode on port ${config.node.port}...`);
    });

    const exitHandler = terminate(server, { coredump: false, timeout: 500 });

    process.on('uncaughtException', exitHandler());
    process.on('unhandledRejection', exitHandler());
    process.on('SIGTERM', exitHandler());
    process.on('SIGINT', exitHandler());
};

module.exports = { start };
