const routes = require('./routes');
const HttpBinder = require('../../utils/http-binder');

module.exports = app => HttpBinder(app, routes);
