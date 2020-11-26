const userModule = ({ app, binder, routes, middleware }) => {
    return binder({ app, routes, middleware });
};

module.exports = userModule;
