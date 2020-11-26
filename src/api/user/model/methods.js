const methods = ({ schema, compare, createHash, randomBytes, sign, config }) => {
    schema.methods.getSignedJwtToken = function () {
        return sign({ id: this._id }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
    };

    schema.methods.matchPassword = async function (enteredPassword) {
        return compare(enteredPassword, this.password);
    };

    schema.methods.getResetPasswordToken = function () {
        const resetToken = randomBytes(20).toString('hex');
        this.resetPasswordToken = createHash('sha256').update(resetToken).digest('hex');
        this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        return resetToken;
    };
};

module.exports = methods;
