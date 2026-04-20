import prisma from '../config/prisma.js';

// ------------------ GET USER PROFILE ------------------
async function getUserProfile(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // ✅ ONLY USER TABLE
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true, // ✅ FIXED (from user table)
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);

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

    // ✅ UPDATE USER TABLE ONLY
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { phone },
    });

    return res.status(200).json({
      message: "Phone updated successfully",
      phone: updated.phone,
    });

  } catch (error) {
    console.error(error);

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


// ------------------ DELETE USER PROFILE ------------------
async function deleteUserProfile(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔥 MASTER DELETE
    await prisma.user.delete({
      where: { id: userId },
    });

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
      message: "User account deleted successfully",
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error deleting user",
    });
  }
}


export {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};