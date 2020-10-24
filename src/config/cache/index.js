import redis from 'redis';
import logger from '../logger/index.js';
import config from '../env/index.js';

const { REDIS_HOST, REDIS_PORT } = config;
const client = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT
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
