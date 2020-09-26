import asyncWrapper from '../../utils/async-wrapper';
import ErrorResponse from '../../utils/error-response';
import response from '../../utils/response-builder';
import User from './model';

const find = asyncWrapper(async (req, res, next) => {
    const users = await User.find();
    return response.build(res, users, 200);
});

const findById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ErrorResponse(`Resource not found with id: '${id}'.`, 404));
    return response.build(res, user, 200);
});

const updateById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = req.body;
    const updatedUser = await User.findByIdAndUpdate(id, user, { new: true, runValidators: true });
    if (!updatedUser) return next(new ErrorResponse(`Resource not found with id: '${id}'.`, 404));
    return response.build(res, updatedUser, 201);
});

export { find, findById, updateById };
