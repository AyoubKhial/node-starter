const protect = require('middleware/protect');

describe('Protect middleware', () => {
    const user = { role: 'USER' };

    it('Should check that token does not exist.', async () => {
        const req = {};
        const res = {};
        const next = jest.fn();
        await protect({})(req, res, next);
        expect(next).toHaveBeenCalledWith({ message: 'Not authorized to access this route', code: 401 });
    });

    it('Should check that token in header is valid.', async () => {
        const roles = ['USER'];
        const userModel = { findById: id => ({ _id: id, role: 'USER' }) };
        const config = {};
        const verifyToken = jest.fn().mockReturnValue({ id: '1' })
        const req = {
            headers: {
                authorization: 'Bearer token'
            },
            user
        };
        const res = {};
        const next = jest.fn();
        await protect({ roles, userModel, config, verifyToken })(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('Should check that token in cookies is valid.', async () => {
        const roles = ['USER'];
        const userModel = { findById: id => ({ _id: id, role: 'USER' }) };
        const config = {};
        const verifyToken = jest.fn().mockReturnValue({ id: '1' })
        const req = {
            cookies: {
                token: 'token'
            },
            user
        };
        const res = {};
        const next = jest.fn();
        await protect({ roles, userModel, config, verifyToken })(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('Should check if role is not allowed.', async () => {
        const roles = ['ADMIN'];
        const userModel = { findById: id => ({ _id: id, role: 'USER' }) };
        const config = {};
        const verifyToken = jest.fn().mockReturnValue({ id: '1' })
        const req = {
            cookies: {
                token: 'token'
            },
            user
        };
        const res = {};
        const next = jest.fn();
        await protect({ roles, userModel, config, verifyToken })(req, res, next);
        expect(next).toHaveBeenCalledWith({
            message: `User with role 'USER' is not authorized to access this route.`,
            code: 403
        });
    });

    it('Should check that token is not valid.', async () => {
        const roles = ['ADMIN'];
        const userModel = { findById: id => ({ _id: id, role: 'USER' }) };
        const config = {};
        const verifyToken = jest.fn().mockReturnValue(null)
        const req = {
            cookies: {
                token: 'token'
            },
            user
        };
        const res = {};
        const next = jest.fn();
        await protect({ roles, userModel, config, verifyToken })(req, res, next);
        expect(next).toHaveBeenCalledWith({ message: 'Not authorized to access this route', code: 401 });
    });
});
