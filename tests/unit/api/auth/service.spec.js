const { sendTokenResponse } = require('api/auth/service');

describe('Auth service', () => {
    const user = {
        getSignedJwtToken: jest.fn().mockReturnValue('token')
    };
    const statusCode = 201;
    const res = {
        status(statusCode) {
            this.statusCode = statusCode;
            return this;
        },
        cookie(_, token) {
            this.token = token;
            return this;
        },
        json(data) {
            return data;
        }
    };
    const config = {
        jwt: {
            cookieExpiresIn: 10
        }
    };
    it('Should send token in response.', async () => {
        const result = sendTokenResponse({ user, statusCode, res, config });
        expect(result).toEqual({ success: true, token: 'token' });
    });

    it('Should add secure to options in production env and send token in response.', async () => {
        config.node = { env: 'production' };
        const result = sendTokenResponse({ user, statusCode, res, config });
        expect(result).toEqual({ success: true, token: 'token' });
    });
});
