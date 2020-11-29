const insert = (arr, index, newItem) => [...arr.slice(0, index), newItem, ...arr.slice(index)];

const camelCase = input => {
    return input.replace(/-([a-z])/g, group => group[1].toUpperCase());
};

const removeExtension = input => {
    return input.split('.').slice(0, -1).join('.');
};

const getMiddlewareList = ({ fs, path }) => {
    const middlewareDirectory = path.join(__dirname, '../middleware');
    const middleware = fs.readdirSync(middlewareDirectory);
    const exclude = ['error-handler.js'];
    const middlewareObject = middleware.reduce((previous, current) => {
        if (exclude.includes(current)) return previous;
        return { ...previous, [removeExtension(camelCase(current))]: require(`../middleware/${current}`) };
    }, {});
    return middlewareObject;
};

const getPathsList = modules => {
    const pathsList = [];
    for (const [key, value] of Object.entries(modules)) {
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

const getRoutesWithMiddleware = ({ routes, middlewareList }) => {
    return routes.map(route => {
        let args = [route.path, route.handler];
        const { path, method, handler, ...middleware } = route;
        for (const [key, value] of Object.entries(middleware)) {
            args = addMiddleware(args, middlewareList[key]({ ...value }));
        }
        return { method: route.method.toLowerCase(), args };
    });
};

module.exports = { getMiddlewareList, getPathsList, getRoutesWithMiddleware };
