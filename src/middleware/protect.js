const protect = ({ roles, userModel, config, verifyToken }) => async (req, res, next) => {
    let token;
    const authorization = req?.headers?.authorization;
    if (authorization && authorization.startsWith('Bearer')) token = authorization.split(' ')[1];
    else if (req?.cookies?.token) token = req?.cookies?.token;
    if (!token) next({ message: 'Not authorized to access this route', code: 401 });
    try {
        const decoded = verifyToken(token, config.jwt.secret);
        req.user = await userModel.findById(decoded.id);
        if (!roles.includes(req?.user?.role)) {
            next({ message: `User with role '${req?.user?.role}' is not authorized to access this route.`, code: 403 });
        }
        next();
    } catch (err) {
        next({ message: 'Not authorized to access this route', code: 401 });
    }
};

module.exports = protect;
