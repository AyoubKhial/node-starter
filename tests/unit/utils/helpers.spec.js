const helpers = require('utils/helpers');

jest.mock('middleware/rate-limiter.js', () => jest.fn());
jest.mock('middleware/protect.js', () => jest.fn());

describe('Helpers utility.', () => {
    it('Should get paths list of modules.', () => {
        const modules = {
            auth: 'auth',
            user: 'user',
            product: 'product'
        }
        const pathsList = helpers.getPathsList(modules);
        expect(pathsList).toEqual(expect.arrayContaining(['auth', 'user', 'product']));
    });

    it('Should get paths list of nested modules.', () => {
        const modules = {
            auth: 'auth',
            user: {
                admin: 'admin'
            },
            product: 'product'
        }
        const pathsList = helpers.getPathsList(modules);
        expect(pathsList).toEqual(expect.arrayContaining(['auth', 'user/admin', 'product']));
    });

    it('Should get middleware list.', () => {
        const middleware = ['protect.js', 'rate-limiter.js'];
        const path = { join: jest.fn() };
        const fs = { readdirSync: jest.fn().mockReturnValue(middleware) };
        const middlewareList = helpers.getMiddlewareList({ fs, path });
        expect(middlewareList).toHaveProperty('protect');
        expect(middlewareList).toHaveProperty('rateLimiter');
    });

    it('Should get middleware list without error-handler middleware.', () => {
        const middleware = ['protect.js', 'rate-limiter.js', 'error-handler.js'];
        const path = { join: jest.fn() };
        const fs = { readdirSync: jest.fn().mockReturnValue(middleware) };
        const middlewareList = helpers.getMiddlewareList({ fs, path });
        expect(middlewareList).toHaveProperty('protect');
        expect(middlewareList).toHaveProperty('rateLimiter');
        expect(middlewareList).not.toHaveProperty('errorHandler');
    });

    it('Should get routes without adding a middleware.', () => {
        const routes = [
            {
                path: '/users',
                method: 'GET',
                handler: () => {}
            }
        ];
        const routesWithMiddleware = helpers.getRoutesWithMiddleware({ routes });
        expect(routesWithMiddleware[0]).toHaveProperty('method');
        expect(routesWithMiddleware[0].method).toEqual('get')
        expect(routesWithMiddleware[0]).toHaveProperty('args');
        expect(routesWithMiddleware[0].args[0]).toEqual('/users');
        expect(routesWithMiddleware[0].args[1].name).toEqual('handler');
    });

    it('Should get routes with a single middleware.', () => {
        const routes = [
            {
                path: '/users',
                method: 'GET',
                handler: () => {},
                protect: jest.fn()
            }
        ];
        routes[0].protect = jest.fn();
        const protect = jest.fn();
        const routesWithMiddleware = helpers.getRoutesWithMiddleware({ routes, middlewareList: { protect } });
        expect(routesWithMiddleware[0]).toHaveProperty('method');
        expect(routesWithMiddleware[0].method).toEqual('get')
        expect(routesWithMiddleware[0]).toHaveProperty('args');
        expect(routesWithMiddleware[0].args[0]).toEqual('/users');
        expect(routesWithMiddleware[0].args[2].name).toEqual('handler');
    });

    it('Should get routes with multiple middleware.', () => {
        const routes = [
            {
                path: '/users',
                method: 'GET',
                handler: () => {},
                protect: jest.fn(),
                rateLimiter: jest.fn()
            }
        ];
        routes[0].protect = jest.fn();
        const protect = jest.fn();
        const rateLimiter = jest.fn();
        const routesWithMiddleware = helpers.getRoutesWithMiddleware({ routes, middlewareList: { protect, rateLimiter } });
        expect(routesWithMiddleware[0]).toHaveProperty('method');
        expect(routesWithMiddleware[0].method).toEqual('get')
        expect(routesWithMiddleware[0]).toHaveProperty('args');
        expect(routesWithMiddleware[0].args[0]).toEqual('/users');
        expect(routesWithMiddleware[0].args[3].name).toEqual('handler');
    });
});
