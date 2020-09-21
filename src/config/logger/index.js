import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint, errors, colorize, simple } = format;

const options = {
    file: {
        level: 'info',
        filename: path.join(__dirname, '../../logs/app.log'),
        handleExceptions: true,
        format: combine(errors({ stack: true }), timestamp(), prettyPrint()),
        maxsize: 5242880
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: combine(colorize(), simple())
    }
};

const logger = new createLogger({
    transports: [new transports.File(options.file), new transports.Console(options.console)],
    exitOnError: false
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: message => {
        // use the 'info' log level so the output will be picked up by both transports
        logger.info(message);
    }
};

export default logger;
