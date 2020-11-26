const preSaveHook = function preSaveHook(genSalt, hash) {
    return async function (next) {
        if (!this.isModified('password')) next();
        const salt = await genSalt();
        this.password = await hash(this.password, salt);
    };
};

module.exports = { preSaveHook };
