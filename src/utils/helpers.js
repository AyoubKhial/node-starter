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

module.exports = { camelCase, removeExtension, getMiddleware, getPathsList };
