const connect = async ({ mongoose, config, logger }) => {
    const url = `mongodb://${config.database.host}:${config.database.port}/${config.database.name}`;
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

module.exports = { connect };
