import { verifyAccessToken } from "../utils/jwt.js";

export const isAuthenticated = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res.status(401).json({ message: "User is not authenticated!" });
  }

  try {
    const user = verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Token has expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const isAuthorized = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole || !requiredRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Access denied! This user does not have permission to access this!",
      });
    }
    next();
  };
};