import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Route protection middleware.
 * Expects a bearer token in the Authorization header:
 *   Authorization: Bearer <token>
 * Verifies the JWT, loads the user, and attaches it to req.user so
 * downstream handlers know who is making the request. Requests without
 * a valid token are rejected with 401.
 */
export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, no token" });
    }

    // Throws if the token is invalid or expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user (without the password) to the request.
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, token failed" });
  }
};
