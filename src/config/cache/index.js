const redis = require('redis');
const logger = require('../logger');
const config = require('../env');

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

module.exports = { connect, client };
