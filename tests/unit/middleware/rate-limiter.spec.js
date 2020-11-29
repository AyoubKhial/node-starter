const rateLimiter = require('middleware/rate-limiter');

describe('Rate limiter middleware', () => {
    it('Should check that token does not exist.', async () => {
        const rateLimit = options => options;
        const extraOptions = { windowMs: 1 * 60 * 1000, max: 5 };
        const response = rateLimiter({ rateLimit, extraOptions });
        expect(response).toHaveProperty('message');
        expect(response.message).toEqual({ success: false, error: 'You have exceeded the 5 requests in 1 minutes limit!' });
    });
});
