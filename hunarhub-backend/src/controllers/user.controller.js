//Import Libraries
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//Imports
import prisma from '../config/prisma.js';
import { verifyToken,generateAccessToken, generateRefreshToken } from '../utils/jwt.js';



//-------------------Controller Functions----------------



//-------Auth Controllers----------

//.......Test User Controller Function.........
function testUser(req,res){
    res.send('Hello, I am Anindya Biswas!!');
}

//............RefreshToken Controller Function...........
async function refreshTokenController(req, res) {

    let refreshToken;

    // Try cookies
    if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    // Fallback to Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        refreshToken = req.headers.authorization.split(' ')[1];
    }

    // If no token found
    if (!refreshToken) {
        return res.status(401).json({
            message: 'No refresh token provided'
        });
    }

    try {
        // Check DB first
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });

        // Token reuse detection
        if (!storedToken) {

            const decoded = verifyToken(refreshToken, process.env.REFRESH_SECRET);

            await prisma.refreshToken.deleteMany({
                where: { userId: decoded.id }
            });

            return res.status(403).json({
                message: 'Token reuse detected. All sessions revoked.'
            });
        }

        // Verify token
        const decoded = verifyToken(refreshToken, process.env.REFRESH_SECRET);

        // ✅ Fetch user from DB (IMPORTANT FIX)
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        // Generate new access token
        const newAccessToken = generateAccessToken({ id: decoded.id });

        return res.json({
            accessToken: newAccessToken,
            user // ✅ NOW frontend can restore state
        });

    } catch (error) {
        console.error(error);
        return res.status(403).json({
            message: 'Invalid refresh token'
        });
    }
}


//........Register User Controller Function...........
async function registerUser(req,res){
    //....Flow.....
    //1. req.body
    //2.Validation
    //3.Try-Catch block starts
    //4.Existing Mail Checker
    //5.Password Hashing
    //6.Create User table, response and error Handling

    const { name,email,password } = req.body;

    //Validation of Required Fields
    if(!name || !email || !password){
        return res.status(400).json({
            message: 'All Fields are Required!!'
        });
    }

    try {
        //Email trimming
        const cleanEmail = email.trim().toLowerCase();

        //Existing Email Checker
        const existingUser = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });
        if(existingUser){
            return res.status(400).json({
                message: 'This Email is already registered'
            });
        }

        //Password Hashing 
        const hashedPassword = await bcrypt.hash(password, 10);


        //Create Table
        await prisma.user.create({
            data: {
                name,
                email: cleanEmail,
                password: hashedPassword
            }
        });

        //Response
        res.status(201).json({
        message: 'User Created Successfully.'
        });

    } catch (error) {
        //Error Handling
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}

//.........Login User Controller Function.........
async function loginUser(req,res){
    const { email,password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    if(!email || !password){
        return res.status(400).json({
            message: 'All fields are required'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });

        if(!user){
            return res.status(400).json({
                message: 'The user does not exist'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
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

        // ✅ FIX: return user
        return res.status(200).json({
            message: 'Login Successful.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email
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

    //Try body(for tests only)
    if(req.body && req.body.refreshToken){
        refreshToken = req.body.refreshToken;

    }
    //Try cookies (for production)
    else if (req.cookies && req.cookies.refreshToken) {
        refreshToken = req.cookies.refreshToken;
    }

    //If no token(token validation)
    if (!refreshToken) {
        return res.status(400).json({
            message: 'Refresh token required'
        });
    }

    try {
        // Delete token from DB
        const deleted = await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });

        if (deleted.count === 0) {
            return res.status(400).json({
                message: 'Token not found or already logged out'
            });
        }

        //clear the cookies, so that the cookies doesnt caryy the tokens by any chance
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

export { testUser,registerUser,loginUser,refreshTokenController,logoutUser };