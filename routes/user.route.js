
import express from "express";
const router = express.Router();
import { register } from "../controllers/user.js";
import { login } from "../controllers/user.js";

//api/user/XYZ
router.route("/register").post(register);
router.route("/login").post(login);


export default router;