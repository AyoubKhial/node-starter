const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];

const addMiddleware = (args, middleware) => {
    const index = args.length - 1;
    const newArgs = insert(args, index, middleware);
    return newArgs;
};

const getRoutesWithMiddleware = ({ route, middleware, cacheService }) => {
    let args = [route.path, route.handler];
    if (route?.protected) args = addMiddleware(args, middleware.protect(route?.protected?.roles));
    if (route?.limit) args = addMiddleware(args, middleware.rateLimiter(route?.limit));
    if (route?.cachedResult) args = addMiddleware(args, middleware.cachedResult({ ...route?.cachedResult, cacheService }));
    if (route?.advancedResult)
        args = addMiddleware(args, middleware.advancedResult({ model: route?.advancedResult?.model, cacheService }));
    if (route?.clearCache) args = addMiddleware(args, middleware.clearCache({ ...route?.clearCache, cacheService }));
    return args;
};

const binder = ({ app, routes, middleware, cacheService }) => {
    for (const route of routes) {
        app[route.method.toLowerCase()](...getRoutesWithMiddleware({ route, middleware, cacheService }));
    }
    return app;
};

module.exports = binder;
