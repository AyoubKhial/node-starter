const cache = require('../config/cache/helper');

const clearCache = ({ collections, methods, types }) => async (req, res, next) => {
    const data = [collections, methods, types];
    const combinations = data.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
    const promises = combinations.map(combination => {
        const keyPattern = `collection:${combination[0]} method:${combination[1]} type:${combination[2]}*`;
        return cache.getKeys(keyPattern);
    });
    console.log(promises);
    const keys = await Promise.all(promises);
    for (const key of keys.flat()) {
        cache.remove(key);
    }
    next();
};

module.exports = clearCache;
