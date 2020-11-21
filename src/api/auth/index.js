const routes = require('./routes.js');
const HttpBinder = require('../../utils/http-binder.js');

module.exports = app => HttpBinder(app, routes);
