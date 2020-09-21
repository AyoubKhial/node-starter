import logger from '../logger';

const terminate = (server, options = { coredump: false, timeout: 500 }) => {
    const exit = code => {
        options.coredump ? process.abort() : process.exit(code);
    };

    return () => err => {
        if (err && err instanceof Error) logger.error(err.message, err.stack);
        // Attempt a graceful shutdown
        server.close(exit);
        // If server hasn't finished in 1000ms, shut down process
        // Prevents the timeout from registering on event loop with 'unref' function
        setTimeout(exit, options.timeout).unref();
    };
};

module.exports = terminate;
