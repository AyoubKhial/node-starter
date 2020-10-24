import * as cache from './config/cache/index.js';
import database from './config/database/index.js';
import server from './config/server/index.js';

cache.connect();
(async () => {
    await Promise.all([server.start(), database.connect()]);
})();
