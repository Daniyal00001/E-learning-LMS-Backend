import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generatetoken.js";


export const register = async (req, res) => {
  console.log("register");
  const { email, name, password } = req.body;

  try {

    if (!email || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
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


export const login = async(req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
               success: false,
               error: "Invalid password"
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful"
        });

        generateToken(user, res);

    } catch (error) {
        console.error(error);
        if (error.code === 'P2002') {
            return res.status(409).json({ 
              success : false,
              message: "Email already exists" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}