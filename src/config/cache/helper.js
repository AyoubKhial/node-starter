import util from 'util';
import { client } from './index.js';

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

export { set, get, remove, getKeys };
