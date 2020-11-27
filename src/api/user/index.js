const userModule = ({ binder, routes, middlewareList }) => {
    return binder({ routes, middlewareList });
};

module.exports = userModule;
