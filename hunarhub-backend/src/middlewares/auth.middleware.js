import { verifyToken } from '../utils/jwt.js';

function authMiddleware(req, res, next) {
    let token;

    // 1. Try to get token from cookies
    if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    // 2. Fallback to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 3. If no token found
    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    try {
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid Token'
        });
    }
}

export default authMiddleware;