const userModule = ({ binder, routes, middleware, cacheService, config, userModel }) => {
    return binder({ routes, middleware, cacheService, config, userModel });
};

module.exports = userModule;
