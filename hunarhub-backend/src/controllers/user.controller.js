//Imports
import prisma from '../config/prisma.js';

//.......Test User.........
function testUser(req,res){
    res.send('Hello, I am Anindya Biswas!!');
}

//........Register User...........
async function registerUser(req,res){
    const { name,email,password } = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            message: 'All Fields are Required!!'
        });
    }

    
    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        });

        res.status(201).json({
        message: 'User Created Successfully.'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Something went wrong when User Registering!!'
        });
    }


}

export { testUser,registerUser };