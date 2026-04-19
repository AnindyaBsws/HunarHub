//Import Libraries
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Imports
import prisma from '../config/prisma.js';
import { verifyToken, generateAccessToken, generateRefreshToken } from '../utils/jwt.js';


//-------------------Controller Functions----------------


//-------Auth Controllers----------

//.......Test User Controller Function.........
function testUser(req, res) {
    res.send('Hello, I am Anindya Biswas!!');
}

//............RefreshToken Controller Function...........
async function refreshTokenController(req, res) {

    let refreshToken;

    if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        refreshToken = req.headers.authorization.split(' ')[1];
    }

    if (!refreshToken) {
        return res.status(401).json({
            message: 'No refresh token provided'
        });
    }

    try {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        if (!storedToken) {
            const decoded = verifyToken(refreshToken, process.env.REFRESH_SECRET);

            await prisma.refreshToken.deleteMany({
                where: { userId: decoded.id }
            });

            return res.status(403).json({
                message: 'Token reuse detected. All sessions revoked.'
            });
        }

        const decoded = verifyToken(refreshToken, process.env.REFRESH_SECRET);

        // ✅ IMPORTANT FIX HERE
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                entrepreneurProfile: true
            }
        });

        const newAccessToken = generateAccessToken({ id: decoded.id });

        return res.json({
            accessToken: newAccessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isSeller: !!user.entrepreneurProfile
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(403).json({
            message: 'Invalid refresh token'
        });
    }
}


//........Register User Controller Function...........
async function registerUser(req, res) {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'All Fields are Required!!'
        });
    }

    try {
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'This Email is already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email: cleanEmail,
                password: hashedPassword
            }
        });

        res.status(201).json({
            message: 'User Created Successfully.'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}


//.........Login User Controller Function.........
async function loginUser(req, res) {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    if (!email || !password) {
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: cleanEmail },
            include: {
                entrepreneurProfile: true
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'The user does not exist'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid Credentials.'
            });
        }

        const payload = { id: user.id, email: user.email };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        });

        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            });

        // ✅ IMPORTANT FIX HERE
        return res.status(200).json({
            message: 'Login Successful.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isSeller: !!user.entrepreneurProfile
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}


//...............Logout User Function Controller...........
async function logoutUser(req, res) {

    let refreshToken;

    if (req.body && req.body.refreshToken) {
        refreshToken = req.body.refreshToken;
    }
    else if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    if (!refreshToken) {
        return res.status(400).json({
            message: 'Refresh token required'
        });
    }

    try {
        const deleted = await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });

        if (deleted.count === 0) {
            return res.status(400).json({
                message: 'Token not found or already logged out'
            });
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.status(200).json({
            message: 'Logout successful'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Logout failed'
        });
    }
}

export { testUser, registerUser, loginUser, refreshTokenController, logoutUser };