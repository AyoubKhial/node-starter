const userModule = require('api/user');

describe('User index', () => {
    it('Should call user with user routes and middleware', async () => {
        const binder = jest.fn()
        const routes = ['route1', 'route2'];
        const middlewareList = ['middleware1', 'middleware2'];
        userModule({ binder, routes, middlewareList });
        expect(binder).toHaveBeenCalledWith({ routes, middlewareList });
    });
});
