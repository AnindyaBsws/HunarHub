//Import Libraries
import bcrypt from 'bcrypt';

//Imports
import prisma from '../config/prisma.js';

//.......Test User.........
function testUser(req,res){
    res.send('Hello, I am Anindya Biswas!!');
}

//........Register User...........
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
        //Existing Email Checker
        const existingUser = await prisma.user.findUnique({
            where: { email }
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
                email,
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


async function loginUser(req,res){
    // ...flow...
    // 1.Get (mail+pass)
    // 2.Validation
    // 3.find user in Db
    // 4.compare pass(bcrypt)
    // 5.Send Response
    // 6.Error Handling

    const { email,password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    //Validation
    if(!email || !password){
        return res.status(400).json({
            message: 'All fields are required'
        });
    }


    try {
        //Find user in DB
        const user = await prisma.user.findUnique({
            where: { email: cleanEmail }
        });
        if(!user){
            return res.status(400).json({
                message: 'The user does not exist'
            });
        }

        //if User found, Compare bcrypt password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message: 'Invalid Credentials.'
            });
        }

        //Success Message
        return res.status(200).json({
            message: 'Login Successful.'
        });

    } catch (error) {
        //Error Handling
        console.error(error);
        res.status(500).json({
            message: 'Server Error'
        });
    }
}

export { testUser,registerUser,loginUser };