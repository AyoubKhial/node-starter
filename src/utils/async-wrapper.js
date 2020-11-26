const asyncWrapper = fn => ({ req, res, next, ...rest }) => fn({ req, res, next, ...rest }).catch(next);

module.exports = asyncWrapper;
