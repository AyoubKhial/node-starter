const advancedResult = require('middleware/advanced-result');

describe('Advanced result middleware', () => {
    const model = {
        countDocuments: () => Promise.resolve(1e3),
        find() {
            return this;
        },
        populate() {
            return this;
        },
        select() {
            return this;
        },
        sort() {
            return this;
        },
        skip() {
            return this;
        },
        limit() {
            return Promise.resolve({ data: 'someData' });
        }
    };
    const cacheService = { set: jest.fn() };
    const query = {
        fields: 'name, quantity',
        sort: '-createdAt',
        expand: 'user',
        page: 5,
        size: 10,
        'age[lte]': 75
    };
    const res = {};
    const next = jest.fn();

    afterEach(() => {
        next.mockClear();
    });

    it('Should check that next get called with old cached result.', async () => {
        const req = {};
        const res = { cachedData: { data: 'some data' } };
        await advancedResult({ model, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('advancedResult');
        expect(res.advancedResult).toEqual({ data: 'some data' });
    });

    it('Should check that next get called with new cached data.', async () => {
        const req = { query };
        await advancedResult({ model, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('advancedResult');
        expect(res.advancedResult).toEqual({
            success: true,
            total: 1000,
            pagination: { next: { page: 6, size: 10 }, prev: { page: 4, size: 10 } },
            data: { data: 'someData' }
        });
    });

    it('Should check that next get called with no pagination param.', async () => {
        const { page, size, ...newQuery } = query;
        const req = { query: newQuery };
        await advancedResult({ model, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('advancedResult');
        expect(res.advancedResult).toEqual({
            success: true,
            total: 1000,
            pagination: { next: { page: 2, size: 100 } },
            data: { data: 'someData' }
        });
    });

    it('Should check that next get called with no fields param.', async () => {
        const { fields, ...newQuery } = query;
        const req = { query: newQuery };
        await advancedResult({ model, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('advancedResult');
        expect(res.advancedResult).toEqual({
            success: true,
            total: 1000,
            pagination: { next: { page: 6, size: 10 }, prev: { page: 4, size: 10 } },
            data: { data: 'someData' }
        });
    });

    it('Should check that next get called with no sort param.', async () => {
        const { sort, ...newQuery } = query;
        const req = { query: newQuery };
        await advancedResult({ model, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('advancedResult');
        expect(res.advancedResult).toEqual({
            success: true,
            total: 1000,
            pagination: { next: { page: 6, size: 10 }, prev: { page: 4, size: 10 } },
            data: { data: 'someData' }
        });
    });

    it('Should check that next get called with no expand param.', async () => {
        const { expand, ...newQuery } = query;
        const req = { query: newQuery };
        await advancedResult({ model, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('advancedResult');
        expect(res.advancedResult).toEqual({
            success: true,
            total: 1000,
            pagination: { next: { page: 6, size: 10 }, prev: { page: 4, size: 10 } },
            data: { data: 'someData' }
        });
    });

    it('Should check that next get called with last page.', async () => {
        query.page = 100;
        const req = { query };
        await advancedResult({ model, cacheService })(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(res).toHaveProperty('advancedResult');
        expect(res.advancedResult).toEqual({
            success: true,
            total: 1000,
            pagination: { prev: { page: 99, size: 10 } },
            data: { data: 'someData' }
        });
    });
});
