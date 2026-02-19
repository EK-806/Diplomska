import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/connectDB.js";
import userRouter from "./routes/userRouter.js";
import packageRouter from "./routes/packageRouter.js";
import { errorMiddleware } from "./middleware/error.js"
import path from 'path';

dotenv.config({ path: "./config/config.env" });

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "PUT", "DELETE", "POST", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnection();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/package", packageRouter);

app.use(errorMiddleware);

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

export default app;