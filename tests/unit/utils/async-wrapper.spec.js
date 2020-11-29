const asyncWrapper = require('utils/async-wrapper');

describe('Async wrapper utility', () => {
    it('Should return a successful promise data.', async () => {
        const promiseFunction = () => Promise.resolve({ data: 'some data' });
        const promise = await asyncWrapper(promiseFunction)({});
        expect(promise).toEqual({ data: 'some data' });
    });

    it('Should call the next function.', async () => {
        const next = jest.fn();
        const promiseFunction = () => Promise.reject();
        await asyncWrapper(promiseFunction)({ next });
        expect(next).toHaveBeenCalled();
    });
});
