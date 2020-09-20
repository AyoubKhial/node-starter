import express from 'express';
import config from '../config/env-vars';

const app = express();

const start = () => {
    // This is a simple test route
    app.get('/', (req, res) => {
        res.send('Hello world');
    });

    app.listen(config.PORT, () => {
        console.log(`Server running in ${config.ENV} mode on port ${config.PORT}...`);
    });
};

export default { start };
