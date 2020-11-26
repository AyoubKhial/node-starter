const cacheClient = () => {
    return {
        client: undefined,
        setClient({ redis, config }) {
            client = redis.createClient({
                host: config.redis.host,
                port: config.redis.port
            });
        },

        getClient() {
            return client;
        },

        connect({ redis, config, logger }) {
            this.setClient({ redis, config });
            client.on('connect', () => {
                logger.info(`Redis connected on port: ${client?.options?.port}`);
            });
            client.on('error', err => {
                logger.error(`500 - Could not connect to Redis: ${err}`);
            });
        }
    };
};

module.exports = cacheClient;
