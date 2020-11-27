const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];

const camelCase = input => {
    return input.replace(/-([a-z])/g, group => group[1].toUpperCase());
};

const removeExtension = input => {
    return input.split('.').slice(0, -1).join('.');
};

const getMiddleware = ({ fs, path }) => {
    const middlewareDirectory = path.join(__dirname, '../middleware');
    const middleware = fs.readdirSync(middlewareDirectory);
    const exclude = ['error-handler.js'];
    const middlewareObject = middleware.reduce((previous, current) => {
        if (exclude.includes(current)) return previous;
        return { ...previous, [removeExtension(camelCase(current))]: require(`../middleware/${current}`) };
    }, {});
    return middlewareObject;
};

const getPathsList = node => {
    const pathsList = [];
    for (const [key, value] of Object.entries(node)) {
        if (value && typeof value === 'object') pathsList.push(...getPathsList(value).map(p => `${key}/${p}`));
        else pathsList.push(key);
    }
    return pathsList;
};

const addMiddleware = (args, middleware) => {
    const index = args.length - 1;
    const newArgs = insert(args, index, middleware);
    return newArgs;
};

const getRoutesWithMiddleware = ({ routes, middleware, config, cacheService, userModel }) => {
    return routes.map(route => {
        let args = [route.path, route.handler];
        if (route?.protected)
            args = addMiddleware(args, middleware.protect({ roles: route?.protected?.roles, config, userModel }));
        if (route?.limit) args = addMiddleware(args, middleware.rateLimiter(route?.limit));
        if (route?.cachedResult)
            args = addMiddleware(args, middleware.cachedResult({ ...route?.cachedResult, cacheService }));
        if (route?.advancedResult)
            args = addMiddleware(args, middleware.advancedResult({ model: route?.advancedResult?.model, cacheService }));
        if (route?.clearCache) args = addMiddleware(args, middleware.clearCache({ ...route?.clearCache, cacheService }));
        return { method: route.method.toLowerCase(), args };
    });
};

module.exports = { getMiddleware, getPathsList, getRoutesWithMiddleware };
