const advancedResult = require('../middleware/advanced-result.js');
const clearCache = require('../middleware/clear-cache.js');
const cachedResult = require('../middleware/cached-result.js');
const protect = require('../middleware/auth.js');
const rateLimiter = require('../middleware/rate-limiter.js');

const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];

const addMiddleware = (args, middleware) => {
    const index = args.length - 1;
    const newArgs = insert(args, index, middleware);
    return newArgs;
};

const binder = (app, routes) => {
    for (const route of routes) {
        let args = [route.path, route.handler];
        if (route?.protected) args = addMiddleware(args, protect(route?.protected?.roles));
        if (route?.limit) args = addMiddleware(args, rateLimiter(route?.limit));
        if (route?.cachedResult) args = addMiddleware(args, cachedResult(route?.cachedResult));
        if (route?.advancedResult) args = addMiddleware(args, advancedResult(route?.advancedResult?.model));
        if (route?.clearCache) args = addMiddleware(args, clearCache(route?.clearCache));
        app[route.method.toLowerCase()](...args);
    }
    return app;
};

module.exports = binder;
