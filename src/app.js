const cache = require('config/cache');
const database = require('config/database');
const server = require('config/server');

cache().connect({
    redis: require('redis'),
    config: require('./config/env'),
    logger: require('./config/logger')
});

// TODO: Use top level await when enabling it by eslint. (it would be available when top await proposal reach stage 4)
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
