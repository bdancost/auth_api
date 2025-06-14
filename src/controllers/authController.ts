// src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    res.status(400).json({ error: "Usuário já existe" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(email, hashedPassword);

  res.status(201).json({ id: newUser.id, email: newUser.email });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    res.status(401).json({ error: "Credenciais inválidas" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.json({ token });
};
