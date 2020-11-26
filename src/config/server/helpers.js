const getPathsList = node => {
    const pathsList = [];
    for (const [key, value] of Object.entries(node)) {
        if (value && typeof value === 'object') pathsList.push(...getPathsList(value).map(p => `${key}/${p}`));
        else pathsList.push(key);
    }
    return pathsList;
};

module.exports = getPathsList;
