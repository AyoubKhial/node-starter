const cachedResult = ({ collection, method, type, keys, source, cacheService }) => async (req, res, next) => {
    const origin = source === 'query' ? req.query : source === 'body' ? req.body : req.params;
    const data = { collection, method, type };
    const keysValues = keys.reduce((target, current) => ({ ...target, [current]: origin[current] }), {});
    if ('page' in keysValues && !keysValues.page) keysValues.page = 1;
    if ('size' in keysValues && !keysValues.size) keysValues.size = 100;
    const dataAsString = Object.entries({ ...data, ...keysValues }).reduce((a, b) => `${a} ${b[0]}:${b[1]}`, '');
    const cachedData = await cacheService.get(dataAsString.trim());
    if (cachedData !== null) res.cachedData = JSON.parse(cachedData);
    return next();
};

module.exports = cachedResult;
