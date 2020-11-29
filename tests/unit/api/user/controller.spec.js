const userController = require('api/user/controller');

jest.mock('utils/async-wrapper.js', () => fn => ({ ...args }) => fn({ ...args }));

describe('User controller', () => {
    const req = {
        params: {
            id: '1'
        }
    };
    const res = {
        advancedResult: {
            data: 'some data'
        }
    };
    const next = jest.fn();
    const response = {
        build: (_, data, code) => ({ data, code })
    };
    const userModel = {
        findById: id => ({ _id: id, name: 'user name' }),
        findByIdAndUpdate: id => ({ _id: id, name: 'new user name' }),
        findByIdAndDelete: id => ({ _id: id, name: 'user name' })
    };

    afterEach(() => {
        next.mockClear();
    });

    it('Should get all users.', async () => {
        const result = await userController.find({ req, res, next, response });
        expect(result).toHaveProperty('data');
        expect(result.data).toEqual({ data: 'some data' });
        expect(result).toHaveProperty('code');
        expect(result.code).toEqual(200);
    });

    it('Should get a specific user.', async () => {
        const result = await userController.findById({ req, res, next, response, userModel });
        expect(result).toHaveProperty('data');
        expect(result.data).toEqual({ _id: '1', name: 'user name' });
        expect(result).toHaveProperty('code');
        expect(result.code).toEqual(200);
    });

    it('Should return not found when getting a non existent user.', async () => {
        const userModel = {
            findById: () => null
        };
        await userController.findById({ req, res, next, response, userModel });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({ message: `Resource not found with id: '1'.`, code: 404 });
    });

    it('Should update a specific user.', async () => {
        const result = await userController.updateById({ req, res, next, response, userModel });
        expect(result).toHaveProperty('data');
        expect(result.data).toEqual({ _id: '1', name: 'new user name' });
        expect(result).toHaveProperty('code');
        expect(result.code).toEqual(201);
    });

    it('Should return not found when updating a non existent user.', async () => {
        const userModel = {
            findByIdAndUpdate: () => null
        };
        await userController.updateById({ req, res, next, response, userModel });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({ message: `Resource not found with id: '1'.`, code: 404 });
    });

    it('Should delete a specific user.', async () => {
        const result = await userController.deleteById({ req, res, next, response, userModel });
        expect(result).toHaveProperty('data');
        expect(result.data).toEqual({ _id: '1', name: 'user name' });
        expect(result).toHaveProperty('code');
        expect(result.code).toEqual(201);
    });

    it('Should return not found when deleting a non existent user.', async () => {
        const userModel = {
            findByIdAndDelete: () => null
        };
        await userController.deleteById({ req, res, next, response, userModel });
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith({ message: `Resource not found with id: '1'.`, code: 404 });
    });
});
