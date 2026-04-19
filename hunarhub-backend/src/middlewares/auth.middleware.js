import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  let token;

  // 1. Try cookie
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 2. Try Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 🔥 NO TOKEN → allow as guest
  if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();

  } catch (error) {
    // 🔥 INVALID TOKEN → treat as guest
    req.userId = null;
    next();
  }
}

export default authMiddleware;