const cache = require('./config/cache');
const database = require('./config/database');
const server = require('./config/server');

cache.connect();
(async () => {
    await Promise.all([server.start(), database.connect()]);
})();
