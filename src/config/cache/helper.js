const util = require('util');
const { client } = require('./index.js');

const set = ({ key, data, mode, expiresIn }) => {
    client.set(key, data, mode, expiresIn);
};

const get = key => {
    client.get = util.promisify(client.get);
    return client.get(key);
};

const remove = key => {
    client.del(key);
};

const getKeys = keyPattern => {
    client.keys = util.promisify(client.keys);
    return client.keys(keyPattern);
};

module.exports = { set, get, remove, getKeys };
