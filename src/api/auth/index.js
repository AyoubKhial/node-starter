const authModule = ({ app, binder, routes, middleware, cacheService, config, userModel }) => {
    return binder({ app, routes, middleware, cacheService, config, userModel });
};

module.exports = authModule;
