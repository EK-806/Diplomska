import express from "express";
import { body } from "express-validator";
import {
  GetAllUsers,
  Register,
  Login,
  UpdateAccessToken,
  ChangeUserRole,
  GetUserData,
  ChangeProfilePicture,
  GetDeliveryDrivers,
  Logout,
  SendContactMessage
} from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import Upload from "../utils/multerUpload.js";

const userRouter = express.Router();

userRouter.post("/register", Upload.single("profilePicture"), Register);
userRouter.post("/login", Login);
userRouter.get("/logout", isAuthenticated, Logout);
userRouter.post("/update-token", UpdateAccessToken);
userRouter.get("/deliverydrivers", GetDeliveryDrivers);
userRouter.get("/userdata/:_id", isAuthenticated, GetUserData);
userRouter.get("/all-users", GetAllUsers);
userRouter.patch("/change-role", isAuthenticated, isAuthorized(["Agent"]), ChangeUserRole);
userRouter.put("/change-profile-picture", isAuthenticated, Upload.single("profilePicture"), ChangeProfilePicture);
userRouter.post(
  "/send",
  [
    body("name").trim().isLength({ min: 2 }),
    body("email").isEmail(),
    body("phoneNumber").trim().isLength({ min: 6 }),
    body("message").trim().isLength({ min: 10 }),
  ],
  SendContactMessage
);

export default userRouter;