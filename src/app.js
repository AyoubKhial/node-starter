const cache = require('./config/cache');
const database = require('./config/database');
const server = require('./config/server');

cache.connect({
    redis: require('redis'),
    config: require('./config/env'),
    logger: require('./config/logger')
});
(async () => {
    await Promise.all([
        server.start({
            app: await require('./config/server/express'),
            config: require('./config/env'),
            logger: require('./config/logger'),
            terminate: require('./config/server/terminate')
        }),
        database.connect({
            mongoose: require('mongoose'),
            config: require('./config/env'),
            logger: require('./config/logger')
        })
    ]);
})();
