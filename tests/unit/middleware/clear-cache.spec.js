const clearCache = require('middleware/clear-cache');

describe('Clear cache middleware', () => {
    it('Should check that next get called in clear cache middleware.', async () => {
        const options = {
            collections: ['User'],
            methods: ['GET'],
            types: ['list']
        };
        const cacheService = {
            getKeys: jest.fn(),
            remove: jest.fn()
        };
        const req = {};
        const res = {};
        const next = jest.fn();
        await clearCache({ ...options, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
