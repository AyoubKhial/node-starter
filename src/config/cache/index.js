import redis from 'redis';
import logger from '../logger/index.js';
import config from '../env/index.js';

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port
});

const connect = () => {
    client.on('connect', () => {
        logger.info(`Redis connected on port: ${client?.options?.port}`);
    });
    client.on('error', err => {
        logger.error(`500 - Could not connect to Redis: ${err}`);
    });
};

export { connect, client };
