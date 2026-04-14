import jwt from 'jsonwebtoken';

//Generate Access Token
export function generateAccessToken(user){
    return jwt.sign(
        //payload -> User data
        //Secret -> security key
        //Options -> token validity

        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
}

//Generate Refresh Token
export function generateRefreshToken(payload){
    return jwt.sign(
        //payload -> User data
        //Secret -> security key
        //Options -> token validity

        
        payload,
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

//Verify Token
export function verifyToken(token, secret){
    return jwt.verify(token, secret);
}