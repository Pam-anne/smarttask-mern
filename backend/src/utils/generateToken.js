import jwt from "jsonwebtoken";

/**
 * Create a signed JWT for the given user id.
 * The token is signed with JWT_SECRET and expires after JWT_EXPIRES_IN
 * (defaults to 7 days). The client sends it back in the Authorization
 * header to access protected routes.
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export default generateToken;
