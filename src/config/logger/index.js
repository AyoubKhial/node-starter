import path from 'path';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint, errors, colorize, printf } = format;

const logFormat = printf(info => {
    const output = info.stack ? `${info.level}: ${info.message}\n${info.stack}` : `${info.level}: ${info.message}`;
    return output;
});

const options = {
    file: {
        level: 'info',
        filename: path.join(__dirname, '../../logs/app.log'),
        handleExceptions: true,
        format: combine(timestamp(), prettyPrint()),
        maxsize: 5242880
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        format: combine(colorize(), logFormat)
    }
};

const logger = new createLogger({
    format: combine(errors({ stack: true })),
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
