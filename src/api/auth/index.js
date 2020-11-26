const authModule = ({ app, binder, routes, middleware, cacheService }) => {
    return binder({ app, routes, middleware, cacheService });
};

module.exports = authModule;
