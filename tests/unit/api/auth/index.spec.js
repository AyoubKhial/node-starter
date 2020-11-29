const authModule = require('api/auth');

describe('Auth index', () => {
    it('Should call auth with auth routes and middleware', async () => {
        const binder = jest.fn();
        const routes = ['route1', 'route2'];
        const middlewareList = ['middleware1', 'middleware2'];
        authModule({ binder, routes, middlewareList });
        expect(binder).toHaveBeenCalledWith({ routes, middlewareList });
    });
});
