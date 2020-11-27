const authModule = ({ binder, routes, middlewareList }) => {
    return binder({ routes, middlewareList });
};

module.exports = authModule;
