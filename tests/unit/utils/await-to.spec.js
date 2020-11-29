const to = require('utils/await-to');

describe('Await to utility', () => {
    it('Should return data when a promise is resolved.', async () => {
        const promise = Promise.resolve({ data: 'some data' });
        const [err, data] = await to(promise);
        expect(err).toBeNull();
        expect(data).toEqual({ data: 'some data' });
    });
    it('Should return error when promise is rejected.', async () => {
        const promise = Promise.reject({ data: 'some data' });
        const [err, data] = await to(promise);
        expect(data).toBeUndefined();
        expect(err).toEqual({ data: 'some data' });
    });
});
