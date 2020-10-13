const build = (res, data, code) => res.status(code).json(data);

module.exports = { build };
