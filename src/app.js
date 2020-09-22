import './config/env';
import database from './config/database';
import server from './config/server';

(async () => {
    await database.connect();
})();

server.start();
