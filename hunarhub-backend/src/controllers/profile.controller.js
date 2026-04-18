import prisma from '../config/prisma.js';


//-----------User Controllers------------

//.............Profile Controller Function..........


// METHOD : GET /Profile (its protected(by accessToken access JWT) btw)
async function getProfile(req,res){
    try{
        const userId = req.userId;

        const profile = await prisma.entrepreneurProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        createdAt: true
                    }
                },
                categories: true,
                experiences: true
            }
        });

        if(!profile){
            return res.status(404).json({
                message: 'Profile not found'
            });
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            profile
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({
            message: "Server Error"
        });
    }

}



// CREATE PROFILE (Protected):  Method: POST /api/profile/create
async function createProfile(req, res) {
    try {
        console.log("BODY:", req.body);

        const userId = req.userId;

        const { bio, location, phone, avatarUrl, categories, experiences } = req.body;

        const existingProfile = await prisma.entrepreneurProfile.findUnique({
            where: { userId }
        });

        if (existingProfile) {
            return res.status(400).json({
                message: "Profile already exists"
            });
        }

        if (!location || !phone || !categories || categories.length === 0) {
            return res.status(400).json({
                message: "Location, phone, and categories are required"
            });
        }

        const profile = await prisma.entrepreneurProfile.create({
            data: {
                userId,
                bio,
                location,
                phone,
                avatarUrl,

                categories: {
                    connect: (categories || []).map(id => ({
                        id: Number(id)
                    }))
                },

                experiences: {
                    create: (experiences || []).map(exp => ({
                        sector: exp.sector,
                        years: exp.years,
                        isCurrent: exp.isCurrent,
                        description: exp.description
                    }))
                }
            },
            include: {
                categories: true,
                experiences: true
            }
        });

        return res.status(201).json({
            message: "Profile created successfully",
            profile
        });

    } catch (error) {
        console.error("ERROR:", error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}




export { getProfile, createProfile };