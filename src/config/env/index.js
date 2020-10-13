const dotenv = require('dotenv');

const getEnvironmentFileName = environment => {
    const files = {
        development: 'development.env',
        production: 'production.env'
    };
    return files[environment];
};

const environment = process.env.NODE_ENV;

dotenv.config({ path: `./src/config/env/${getEnvironmentFileName(environment)}` });
