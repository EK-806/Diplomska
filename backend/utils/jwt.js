import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

export const updateToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.UPDATE_TOKEN_SECRET,
    { expiresIn: process.env.UPDATE_TOKEN_EXPIRY || "7d" }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyUpdateToken = (token) => {
  return jwt.verify(token, process.env.UPDATE_TOKEN_SECRET);
};

export const sendToken = (user, statusCode, message, res) => {
  const accessToken = generateToken(user);
  const refreshToken = updateToken(user);

  const cookieOptions = {
    expires: new Date(
      Date.now() + (Number(process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000)
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res.status(statusCode).cookie("token", accessToken, cookieOptions).json({
    success: true,
    user,
    message,
    accessToken,
    updateToken: refreshToken,
  });
};