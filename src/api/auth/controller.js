import asyncWrapper from '../../utils/async-wrapper';
import sendTokenResponse from './service';
import User from '../user/model';

const register = asyncWrapper(async (req, res, next) => {
    const userData = req.body;
    const user = await User.create(userData);
    return sendTokenResponse(user, 201, res);
});

export { register };
