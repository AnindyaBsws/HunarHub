import prisma from "../config/prisma.js";


// ------------------ GET USER PROFILE ------------------
async function getUserProfile(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 ALSO FETCH PHONE (if exists)
    const profile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
      select: { phone: true },
    });

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: profile?.phone || "",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
}


// ------------------ UPDATE USER PROFILE ------------------
async function updateUserProfile(req, res) {
  try {
    const userId = req.userId;
    const { phone } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!phone || phone.length < 5) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    // 🔥 CHECK IF PROFILE EXISTS
    const existingProfile = await prisma.entrepreneurProfile.findUnique({
      where: { userId },
    });

    let updated;

    if (existingProfile) {
      // ✅ UPDATE
      updated = await prisma.entrepreneurProfile.update({
        where: { userId },
        data: { phone },
      });
    } else {
      // ✅ CREATE (THIS IS THE FIX 🔥)
      updated = await prisma.entrepreneurProfile.create({
        data: {
          userId,
          phone,
          location: "Not set", // required field
        },
      });
    }

    return res.status(200).json({
      message: "Phone updated successfully",
      phone: updated.phone,
    });

  } catch (error) {
    console.error(error);

    // 🔥 UNIQUE ERROR (phone already exists)
    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Phone already exists",
      });
    }

    return res.status(500).json({
      message: "Error updating profile",
    });
  }
}


export {
  getUserProfile,
  updateUserProfile,
};