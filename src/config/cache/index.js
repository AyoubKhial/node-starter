const redis = require('redis');
const logger = require('../logger');
const { REDIS_HOST, REDIS_PORT } = require('../env');

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

module.exports = { connect, client };
