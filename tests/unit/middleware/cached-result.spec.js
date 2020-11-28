const cachedResult = require('middleware/cached-result');

describe('Cached result middleware', () => {
    const options = {
        collection: 'User',
        method: 'GET',
        type: 'list',
        keys: ['page', 'size', 'sort', 'expand', 'fields'],
        source: 'query'
    };
    const res = {};
    const reqOptions = {
        fields: 'name',
        size: 10,
        page: 1
    };
    const next = jest.fn();
    const cacheService = { get: jest.fn().mockReturnValue(null) };

    afterEach(() => {
        next.mockClear();
    });

    it('Should check that next get called with query source and no cached data.', async () => {
        const req = { query: reqOptions };
        await cachedResult({ ...options, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('Should check that next get called with body source and no cached data.', async () => {
        const req = { body: { ...reqOptions } };
        await cachedResult({ ...options, source: 'body', cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('Should check that next get called with params source and no cached data.', async () => {
        const req = { params: reqOptions };
        await cachedResult({ ...options, source: 'params', cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('Should check that next get called with params source and no page and size params.', async () => {
        const req = { query: { fields: 'name' } };
        await cachedResult({ ...options, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('Should check that next get called with params source and cached data.', async () => {
        const cacheService = { get: jest.fn().mockReturnValue('{"data":"some data"}') };
        const req = { query: reqOptions };
        await cachedResult({ ...options, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('cachedData');
        expect(res.cachedData).toEqual({ data: 'some data' });
    });
});
