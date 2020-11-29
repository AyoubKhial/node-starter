const { sendTokenResponse } = require('api/auth/service');

describe('Auth service', () => {
    it('Should call auth with auth routes and middleware', async () => {
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
            },
            node: {
                env: 'production'
            }
        };
        const result = sendTokenResponse({ user, statusCode, res, config });
        expect(result).toEqual({ success: true, token: 'token' });
    });
});
