import mongoose from 'mongoose';
import config from '../env-vars';
import logger from '../logger';

const connect = async () => {
    const url = `mongodb://${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`;
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    };
    try {
        const connection = await mongoose.connect(url, options);
        logger.info(`MongoDB connected: ${connection.connection.name}`);
    } catch (error) {
        logger.error(`500 - Could not connect to MongoDB: ${error.message}`);
    }
};

export default { connect };
