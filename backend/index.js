import express from "express";
import dotenv from "dotenv";
import authRouter from "./routers/auth.router.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/Db.js";
import CourseRoute from "./routers/courseRoutes.js";
import { v2 as cloudinary } from 'cloudinary';
import OrderRoute from "./routers/orderRoutes.js";
dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(cors({
  origin: [...new Set([
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:7000',
    'https://coursesguy.com',
    'https://www.coursesguy.com',
    'https://admin.coursesguy.com',
    'https://api.coursesguy.com'
  ].filter(Boolean))],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/courses", CourseRoute);
app.use("/api/orders", OrderRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});