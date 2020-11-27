const errorHandler = require('middleware/error-handler');

describe('Error handler middleware', () => {
    it('Should check Mongoose bad ObjectID exception is handled.', async () => {
        const responseBuilder = (_, data, code) => ({ data, code });
        const err = { name: 'CastError' };
        const response = errorHandler({ responseBuilder })(err);
        expect(response).toHaveProperty('code');
        expect(response.code).toEqual(404);
        expect(response).toHaveProperty('data');
        expect(response.data).toEqual({ success: false, error: 'Resource not found.' });
    });

    it('Should check Mongoose duplicate key exception is handled.', async () => {
        const responseBuilder = (_, data, code) => ({ data, code });
        const err = { code: 11000 };
        const response = errorHandler({ responseBuilder })(err);
        expect(response).toHaveProperty('code');
        expect(response.code).toEqual(400);
        expect(response).toHaveProperty('data');
        expect(response.data).toEqual({ success: false, error: 'Duplicate field value entered.' });
    });

    it('Should check Mongoose validation exceptions are handled.', async () => {
        const responseBuilder = (_, data, code) => ({ data, code });
        const err = {
            name: 'ValidationError',
            errors: {
                gender: {
                    message: 'X is not a valid enum value for path gender.'
                }
            }
        };
        const response = errorHandler({ responseBuilder })(err);
        expect(response).toHaveProperty('code');
        expect(response.code).toEqual(400);
        expect(response).toHaveProperty('data');
        expect(response.data).toEqual({ success: false, error: ['X is not a valid enum value for path gender.'] });
    });

    it('Should check server exceptions are handled.', async () => {
        const responseBuilder = (_, data, code) => ({ data, code });
        const response = errorHandler({ responseBuilder })();
        expect(response).toHaveProperty('code');
        expect(response.code).toEqual(500);
        expect(response).toHaveProperty('data');
        expect(response.data).toEqual({ success: false, error: 'Server error.' });
    });
});
