import asyncWrapper from '../../utils/async-wrapper';
import ErrorResponse from '../../utils/error-response';
import response from '../../utils/response-builder';
import User from './model';

// example: /users?fields=name,year&sort=-createdAt&age[lte]=75
const find = asyncWrapper(async (req, res, next) => {
    response.build(res, res.advancedResult, 200);
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
    const updatedUser = await User.findByIdAndUpdate(id, { $set: user }, { new: true, runValidators: true });
    if (!updatedUser) return next(new ErrorResponse(`Resource not found with id: '${id}'.`, 404));
    return response.build(res, updatedUser, 201);
});

const deleteById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return next(new ErrorResponse(`Resource not found with id: '${id}'.`, 404));
    return response.build(res, deletedUser, 201);
});

export { find, findById, updateById, deleteById };
