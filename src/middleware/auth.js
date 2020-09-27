import { verify } from 'jsonwebtoken';
import ErrorResponse from '../utils/error-response';
import User from '../api/user/model';

const protect = roles => async (req, res, next) => {
    let token;
    const authorization = req?.headers?.authorization;
    if (authorization && authorization.startsWith('Bearer')) token = authorization.split(' ')[1];
    else if (req?.cookies?.token) token = req?.cookies?.token;
    if (!token) next(new ErrorResponse('Not authorized to access this route', 401));
    try {
        const decoded = verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!roles.includes(req?.user?.role)) {
            next(new ErrorResponse(`User with role '${req?.user?.role}' is not authorized to access this route.`, 403));
        }
        next();
    } catch (err) {
        next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

export default protect;
