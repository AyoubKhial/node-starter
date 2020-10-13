require('./config/env');
const database = require('./config/database');
const server = require('./config/server');

(async () => {
    await Promise.all([server.start(), database.connect()]);
})();
