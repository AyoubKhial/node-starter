let client;

const setClient = ({ redis, config }) => {
    client = redis.createClient({
        host: config.redis.host,
        port: config.redis.port
    });
};

const getClient = () => {
    return client;
};

const connect = ({ redis, config, logger }) => {
    setClient({ redis, config });
    client.on('connect', () => {
        logger.info(`Redis connected on port: ${client?.options?.port}`);
    });
    client.on('error', err => {
        logger.error(`500 - Could not connect to Redis: ${err}`);
    });
};

module.exports = { connect, client: getClient() };
