const authController = require('api/auth/controller');

jest.mock('utils/async-wrapper.js', () => fn => ({ ...args }) => fn({ ...args }));

describe('Auth controller', () => {
    const req = {
        params: {
            resetToken: 'token'
        },
        body: {
            username: 'ayoub.khial',
            email: 'ayoub.khial@gmail.com',
            password: '123456'
        },
        user: {
            username: 'ayoub.khial',
            email: 'ayoub.khial@gmail.com'
        }
    };
    const res = {
        cookie: jest.fn()
    };
    const next = jest.fn();
    const response = {
        build: (_, data, code) => ({ data, code })
    };
    const userModel = {
        create: user => user,
        findOne() {
            return this;
        },
        select: jest.fn().mockReturnValue({ ...req.body, matchPassword: jest.fn().mockReturnValue(true) })
    };
    const service = {
        sendTokenResponse: ({ user, statusCode }) => ({ user, statusCode })
    };
    const crypto = {
        createHash() {
            return this;
        },
        update() {
            return this;
        },
        digest: jest.fn()
    };

    afterEach(() => {
        next.mockClear();
    });

    it('Should register a new user.', async () => {
        const result = await authController.register({ req, res, next, response, userModel, service });
        expect(result).toHaveProperty('user');
        expect(result.user).toEqual(
            expect.objectContaining({
                username: 'ayoub.khial',
                email: 'ayoub.khial@gmail.com'
            })
        );
        expect(result).toHaveProperty('statusCode');
        expect(result.statusCode).toEqual(201);
    });

    it('Should login a user.', async () => {
        const result = await authController.login({ req, res, next, response, userModel, service });
        expect(result).toHaveProperty('user');
        expect(result.user).toEqual(
            expect.objectContaining({
                username: 'ayoub.khial',
                email: 'ayoub.khial@gmail.com'
            })
        );
        expect(result).toHaveProperty('statusCode');
        expect(result.statusCode).toEqual(200);
    });

    it('Should call next if email or/and password are not provided while login.', async () => {
        const req = {
            body: {
                username: 'ayoub.khial'
            }
        };
        await authController.login({ req, res, next, response, userModel, service });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Please provide an email and password.', code: 400 });
    });

    it('Should call next if email does not exist while login.', async () => {
        const userModel = {
            findOne() {
                return this;
            },
            select: jest.fn().mockReturnValue(null)
        };
        await authController.login({ req, res, next, response, userModel, service });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Invalid credentials.', code: 401 });
    });

    it('Should call next if password is incorrect while login.', async () => {
        const userModel = {
            findOne() {
                return this;
            },
            select: jest.fn().mockReturnValue({ ...req.body, matchPassword: jest.fn().mockReturnValue(false) })
        };
        await authController.login({ req, res, next, response, userModel, service });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Invalid credentials.', code: 401 });
    });

    it('Should logout a user.', () => {
        const result = authController.logout({ req, res, next, response });
        expect(result).toHaveProperty('data');
        expect(result.data).toEqual({ success: true });
        expect(result).toHaveProperty('code');
        expect(result.code).toEqual(200);
    });

    it('Should get the logged in user.', () => {
        const result = authController.getLoggedInUser({ req, res, next, response });
        expect(result).toHaveProperty('data');
        expect(result.data).toEqual({
            success: true,
            user: {
                username: 'ayoub.khial',
                email: 'ayoub.khial@gmail.com'
            }
        });
        expect(result).toHaveProperty('code');
        expect(result.code).toEqual(200);
    });

    it('Should send mail when forgetting a password.', async () => {
        const req = {
            body: {
                email: 'ayoub.khial@gmail.com'
            },
            get: jest.fn()
        };
        const userModel = {
            findOne: user => {
                return {
                    ...user,
                    getResetPasswordToken: jest.fn().mockReturnValue('token'),
                    save: jest.fn()
                };
            }
        };
        const mailerService = {
            sendMail: jest.fn()
        };
        const result = await authController.forgotPassword({ req, res, next, response, userModel, mailerService });
        expect(result).toHaveProperty('data');
        expect(result.data).toEqual({ success: true, data: 'Email sent successfully.' });
        expect(result).toHaveProperty('code');
        expect(result.code).toEqual(200);
    });

    it('Should call next if email is not provided while forgetting a password.', async () => {
        const req = {
            body: {}
        };
        await authController.forgotPassword({ req, res, next, response });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Please provide an email.', code: 400 });
    });

    it('Should call next if email does not exist while forgetting a password.', async () => {
        const userModel = {
            findOne: jest.fn().mockReturnValue(null)
        };
        await authController.forgotPassword({ req, res, next, response, userModel });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: `There is no user with 'ayoub.khial@gmail.com' email.`, code: 404 });
    });

    it('Should call next if send email throw errors while forgetting password.', async () => {
        const req = {
            body: {
                email: 'ayoub.khial@gmail.com'
            },
            get: jest.fn()
        };
        const userModel = {
            findOne: user => {
                return {
                    ...user,
                    getResetPasswordToken: jest.fn().mockReturnValue('token'),
                    save: jest.fn()
                };
            }
        };
        const mailerService = {
            sendMail: jest.fn().mockReturnValue(Promise.reject())
        };
        await authController.forgotPassword({ req, res, next, response, userModel, mailerService });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Email could not be sent.', code: 500 });
    });

    it('Should return the user while resetting password.', async () => {
        const userModel = {
            findOne: user => {
                return {
                    ...user,
                    save: jest.fn()
                };
            }
        };
        const result = await authController.resetPassword({ req, res, next, userModel, service, crypto });
        expect(result).toHaveProperty('user');
        expect(result.user).toEqual(
            expect.objectContaining({
                password: '123456'
            })
        );
        expect(result).toHaveProperty('statusCode');
        expect(result.statusCode).toEqual(200);
    });

    it('Should call next if resetToken is not provided while resetting password.', async () => {
        const req = {
            params: {},
            body: {
                password: '123456'
            }
        };
        await authController.resetPassword({ req, res, next, userModel, service, crypto });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Please provide the reset token.', code: 400 });
    });

    it('Should call next if new password is not provided while resetting password.', async () => {
        const req = {
            params: {
                resetToken: 'token'
            },
            body: {}
        };
        await authController.resetPassword({ req, res, next, userModel, service, crypto });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Please provide the new password.', code: 400 });
    });

    it('Should call next if the token is invalid while resetting password.', async () => {
        const req = {
            params: {
                resetToken: 'token'
            },
            body: {
                password: '123456'
            }
        };
        const userModel = {
            findOne: jest.fn().mockReturnValue(null)
        };
        await authController.resetPassword({ req, res, next, userModel, service, crypto });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ message: 'Invalid Token.', code: 401 });
    });
});
