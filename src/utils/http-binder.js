const binder = (app, routes) => {
    for (const route of routes) {
        const args = [route.path, route.handler];
        app[route.method.toLowerCase()](...args);
    }
    return app;
};

export default binder;
