const { getKeys, remove } = require('../config/cache/helper.js');

const clearCache = ({ collections, methods, types }) => async (req, res, next) => {
    const data = [collections, methods, types];
    const combinations = data.reduce((a, b) => a.reduce((r, v) => r.concat(b.map(w => [].concat(v, w))), []));
    const promises = combinations.map(combination => {
        const keyPattern = `collection:${combination[0]} method:${combination[1]} type:${combination[2]}*`;
        return getKeys(keyPattern);
    });
    const keys = await Promise.all(promises);
    for (const key of keys.flat()) {
        remove(key);
    }
    next();
};

module.exports = clearCache;
