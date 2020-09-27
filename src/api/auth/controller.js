import asyncWrapper from '../../utils/async-wrapper';
import ErrorResponse from '../../utils/error-response';
import response from '../../utils/response-builder';
import sendTokenResponse from './service';
import User from '../user/model';

const register = asyncWrapper(async (req, res, next) => {
    const userData = req.body;
    const user = await User.create(userData);
    return sendTokenResponse(user, 201, res);
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) return next(new ErrorResponse('Please provide an email and password', 400));
    const user = await User.findOne({ email }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid credentials', 401));
    const isMatched = await user.matchPassword(password);
    if (!isMatched) return next(new ErrorResponse('Invalid credentials', 401));
    return sendTokenResponse(user, 200, res);
});

const logout = asyncWrapper(async (req, res, next) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000) });
    return response.build(res, { success: true }, 200);
});

export { register, login, logout };
