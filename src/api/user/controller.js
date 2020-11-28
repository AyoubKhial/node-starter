const asyncWrapper = require('utils/async-wrapper.js');

// example: /users?fields=name,year&sort=-createdAt&age[lte]=75
const find = asyncWrapper(async ({ req, res, next, response }) => {
    return response.build(res, res.advancedResult, 200);
});

const findById = asyncWrapper(async ({ req, res, next, response, userModel }) => {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) return next({ message: `Resource not found with id: '${id}'.`, code: 404 });
    return response.build(res, user, 200);
});

const updateById = asyncWrapper(async ({ req, res, next, response, userModel }) => {
    const { id } = req.params;
    const user = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(id, { $set: user }, { new: true, runValidators: true });
    if (!updatedUser) return next({ message: `Resource not found with id: '${id}'.`, code: 404 });
    return response.build(res, updatedUser, 201);
});

const deleteById = asyncWrapper(async ({ req, res, next, response, userModel }) => {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) return next({ message: `Resource not found with id: '${id}'.`, code: 404 });
    return response.build(res, deletedUser, 201);
});

module.exports = { find, findById, updateById, deleteById };
