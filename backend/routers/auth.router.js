import express from "express";
import { login, logout, status } from "../controllers/auth.controller.js";
import { auth } from "../middlarwears/auth.js";


const authRouter = express.Router();


authRouter.get("/", (req, res) => {
    res.send("Auth Router is working!");
});

authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.get("/status", auth, status);

export default authRouter;