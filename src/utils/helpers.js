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

module.exports = { camelCase, removeExtension, getMiddleware };
