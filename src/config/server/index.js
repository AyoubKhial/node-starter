const start = async ({ app, config, logger, terminate }) => {
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
