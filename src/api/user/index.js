const userModule = ({ app, binder, routes, middleware, cacheService }) => {
    return binder({ app, routes, middleware, cacheService });
};

module.exports = userModule;
