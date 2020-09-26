import asyncWrapper from '../../utils/async-wrapper';
import response from '../../utils/response-builder';
import User from './model';

const find = asyncWrapper(async (req, res, next) => {
    const users = await User.fid();
    return response.build(res, users, 200);
});

export { find };
