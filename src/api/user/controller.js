import asyncWrapper from '../../utils/async-wrapper';
import ErrorResponse from '../../utils/error-response';
import response from '../../utils/response-builder';
import User from './model';

const find = asyncWrapper(async (req, res, next) => {
    const users = await User.fid();
    return response.build(res, users, 200);
});

const findById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorResponse(`Resource not found with id: '${id}'.`, 404));
    return response.build(res, user, 200);
});

export { find, findById };
