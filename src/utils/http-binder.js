import advancedResult from '../middleware/advanced-result.js';
import clearCache from '../middleware/clear-cache.js';
import cachedResult from '../middleware/cached-result.js';
import protect from '../middleware/auth.js';
import rateLimiter from '../middleware/rate-limiter.js';

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

export default binder;
