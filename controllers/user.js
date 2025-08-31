import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generatetoken.js";


export const register = async (req, res) => {
  console.log("register works");
  const { email, name, password } = req.body;

  try {

    if (!email || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(409).json({ 
        message: "Email already exists",
        error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { email, name, password: hashedPassword },
    });

    res.status(201).json({
        success:true,
        message:"User created successfully"
    });
  } 
  catch (error) {
    console.error(error);
  }
};


export const login = async (req, res) => {
  console.log("login works");
  try {
    const { email, password } = req.body;

    // 1. Validate input (check empty fields)
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // 4. Generate token
    const token = generateToken(user.id);

    // 5. Set cookie + send response
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { id: user.id, email: user.email, name: user.name , role: user.role, createdAt: user.createdAt , photo: user.photo , enrolledCourses: user.enrolledCourses },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};
