const userModule = ({ app, binder, routes, middleware, cacheService, config, userModel }) => {
    return binder({ app, routes, middleware, cacheService, config, userModel });
};

module.exports = userModule;
