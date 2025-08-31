import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();


export const createUser = async (req, res) => {
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
