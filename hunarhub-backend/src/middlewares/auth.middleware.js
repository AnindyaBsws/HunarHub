import jwt from 'jsonwebtoken';

import { verifyToken } from '../utils/jwt.js';

function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Invalid or missing token format'
        });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
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