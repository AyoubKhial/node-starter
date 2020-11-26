const cacheService = ({ util, client }) => {
    return {
        set: ({ key, data, mode, expiresIn }) => {
            client.set(key, data, mode, expiresIn);
        },
        get: key => {
            client.get = util.promisify(client.get);
            return client.get(key);
        },
        remove: key => {
            client.del(key);
        },
        getKeys: keyPattern => {
            client.keys = util.promisify(client.keys);
            return client.keys(keyPattern);
        }
    };
};

module.exports = cacheService;
