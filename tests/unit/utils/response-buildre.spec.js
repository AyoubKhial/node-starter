const response = require('utils/response-builder');

describe('Response builder utility.', () => {
    it('Should build a response.', () => {
        const res = {
            json: jest.fn(),
            status: jest.fn(() => res)
        };
        const data = { success: true };
        const code = 200;
        response.build(res, data, code);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });
});
