import './config/env';
import database from './config/database';
import server from './config/server';

(async () => {
    await Promise.all([server.start(), database.connect()]);
})();
