const authModule = ({ binder, routes, middleware, cacheService, config, userModel }) => {
    return binder({ routes, middleware, cacheService, config, userModel });
};

module.exports = authModule;
