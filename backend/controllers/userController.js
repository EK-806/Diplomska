import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import { FirebaseToken } from "../utils/firebase.js";
import { generateToken, verifyUpdateToken, sendToken } from "../utils/jwt.js";
import { ErrorHandler } from "../middleware/error.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js"
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

export const Register = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, password, role, idToken } = req.body;

  let user;

  if (idToken) {
    let firebaseUser;
    try {
      firebaseUser = await FirebaseToken(idToken);
    } catch (e) {
      return next(new ErrorHandler("Invalid Firebase token", 401));
    }

    user = await User.findOne({ email: firebaseUser.email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");

      user = new User({
        firstName: firebaseUser.firstName || firstName || "User",
        lastName: firebaseUser.lastName || lastName || "",
        email: firebaseUser.email,
        password: randomPassword,
        profilePicture: firebaseUser.picture || "",
        role: "User",
        authProvider: "google",
      });

      await user.save();
    }

    return sendToken(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      201,
      "User registered successfully",
      res
    );
  }

  if (!email || !password) {
    return next(new ErrorHandler("Email and password required!", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists", 400));
  }

  if (!req.file) {
    return next(new ErrorHandler("Profile picture required!", 400));
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  user = new User({
    firstName,
    lastName,
    email,
    password,
    role: role || "User",
    profilePicture: fileUrl,
    authProvider: "local",
  });

  await user.save();

  return sendToken(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    },
    201,
    "User registered successfully",
    res
  );
});

export const Login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, idToken } = req.body;

  let user;

  if (idToken) {
    let firebaseUser;
    try {
      firebaseUser = await FirebaseToken(idToken);
    } catch (e) {
      return next(new ErrorHandler("Invalid Firebase token", 401));
    }

    user = await User.findOne({ email: firebaseUser.email });

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString("hex");

      user = await User.create({
        firstName: firebaseUser.firstName || "User",
        lastName: firebaseUser.lastName || "",
        email: firebaseUser.email,
        password: randomPassword,
        profilePicture: firebaseUser.picture || "",
        role: "User",
        authProvider: "google",
      });
    }

    return sendToken(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      200,
      "Logged in successfully",
      res
    );
  }

  if (!email || !password) {
    return next(new ErrorHandler("Email and password required!", 400));
  }

  user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email!", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid password!", 401));
  }

  return sendToken(
    {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
    },
    200,
    "Logged in successfully",
    res
  );
});

const DRIVER_CUT = 0.1; 

export const GetDeliveryDrivers = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 0 } = req.query;

  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Number(limit) || 0;
  const skip = (pageNumber - 1) * (limitNumber > 0 ? limitNumber : 0);

  const pipeline = [
    { $match: { role: "DeliveryDriver" } },
    { $sort: { createdAt: -1 } },

    {
      $lookup: {
        from: "packages",
        let: { driverId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$deliveryDriverId", "$$driverId"] },
                  { $eq: ["$status", "Delivered"] },
                ],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: "deliveredPackages",
      },
    },

    {
      $lookup: {
        from: "payments",
        let: { pkgIds: "$deliveredPackages._id" },
        pipeline: [
          { $match: { $expr: { $in: ["$packageId", "$$pkgIds"] } } },
          { $project: { paymentAmount: 1 } },
        ],
        as: "relatedPayments",
      },
    },

    {
      $addFields: {
        deliveries: { $size: "$deliveredPackages" },
        totalEarned: {
          $multiply: [
            {
              $sum: {
                $map: {
                  input: "$relatedPayments",
                  as: "p",
                  in: { $ifNull: ["$$p.paymentAmount", 0] },
                },
              },
            },
            DRIVER_CUT,
          ],
        },
      },
    },

    {
      $project: {
        password: 0,
        deliveredPackages: 0,
        relatedPayments: 0,
      },
    },
  ];

  if (limitNumber > 0) {
    pipeline.push({ $skip: skip }, { $limit: limitNumber });
  }

  const deliveryDriver = await User.aggregate(pipeline);
  const total = await User.countDocuments({ role: "DeliveryDriver" });

  if (!deliveryDriver.length) {
    return next(new ErrorHandler("No delivery drivers found", 404));
  }

  res.status(200).json({
    success: true,
    total,
    deliveryDriver,
  });
});

export const GetUserData = catchAsyncErrors(async (req, res, next) => {

  const { _id } = req.params;
  const user = await User.findById(_id).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

export const UpdateAccessToken = catchAsyncErrors(async (req, res, next) => {
  const { updateToken } = req.body;

  if (!updateToken) {
    return next(new ErrorHandler("Refresh token is required", 401));
  }

  try {
    const decoded = verifyUpdateToken(updateToken);
    const newAccessToken = generateToken(decoded);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired refresh token", 403));
  }
});

export const ChangeUserRole = catchAsyncErrors(async (req, res, next) => {

  const { _id, role } = req.body;

  if (!["User", "Agent", "DeliveryDriver"].includes(role)) {
    return next(new ErrorHandler("Role does not exist!", 400));
  }

  const user = await User.findById(_id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  user.role = role;
  await user.save();

  res.status(200).json({ success: true, message: "User role updated successfully" });
});

export const ChangeProfilePicture = catchAsyncErrors(async (req, res, next) => {

  if (!req.file) {
    return next(new ErrorHandler("Please provide a profile picture!", 400));
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: fileUrl },
    { new: true }
  );

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    message: "Profile picture updated successfully",
    profilePicture: user.profilePicture,
  });
});

export const GetAllUsers = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * limitNum;

  const [result] = await User.aggregate([
    { $sort: { createdAt: -1 } },

    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limitNum },

          {
            $lookup: {
              from: "packages",
              localField: "_id",
              foreignField: "userId",
              as: "packages",
            },
          },

          {
            $lookup: {
              from: "payments",
              localField: "_id",
              foreignField: "userId",
              as: "payments",
            },
          },

          {
            $addFields: {
              packagesTotal: { $size: "$packages" },
              moneySpent: {
                $sum: {
                  $map: {
                    input: "$payments",
                    as: "p",
                    in: { $ifNull: ["$$p.paymentAmount", 0] },
                  },
                },
              },
            },
          },

          {
            $project: {
              password: 0,
              packages: 0,
              payments: 0,
            },
          },
        ],

        total: [{ $count: "count" }],
      },
    },
  ]);

  const users = result?.data ?? [];
  const totalUsers = result?.total?.[0]?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalUsers / limitNum));

  if (!users.length) return next(new ErrorHandler("No users found", 404));

  res.status(200).json({
    success: true,
    data: users,
    total: totalUsers,
    pagination: {
      currentPage: pageNum,
      totalPages,
      totalUsers,
      pageSize: limitNum,
    },
  });
});

export const Logout = catchAsyncErrors(async (req, res, next) => {
  try {
    res.status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      })
      .json({
        success: true,
        message: "User logged out!",
      });
  } catch (error) {
    return next(new ErrorHandler("Failed to logout user", 500));
  }
});

export const SendContactMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phoneNumber, message } = req.body;

  if (!name || !email || !phoneNumber || !message) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  await sendEmail({
    email: process.env.MAIL_TO,
    subject: `Contact Message from ${name}`,
    message: 
`Name: ${name}
Email: ${email}
Phone: ${phoneNumber}

Message:
${message}`,
  });

  res.status(200).json({
    success: true,
    message: "Message sent successfully",
  });
});