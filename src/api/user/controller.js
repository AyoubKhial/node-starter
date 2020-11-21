const asyncWrapper = require('../../utils/async-wrapper.js');
const ErrorResponse = require('../../utils/error-response.js');
const response = require('../../utils/response-builder.js');
const User = require('./model.js');

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

module.exports = { find, findById, updateById, deleteById };
