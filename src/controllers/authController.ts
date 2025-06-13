import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../models/User";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis do .env

// Função para registrar novo usuário
export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Verifica se o e-mail já existe no banco
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({ error: "Usuário já existe" });
  }

  // Criptografa a senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Cria o usuário com a senha criptografada
  const newUser = await createUser(email, hashedPassword);

  // Retorna o novo usuário (sem mostrar a senha)
  res.status(201).json({ id: newUser.id, email: newUser.email });
};

// Função para fazer login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Busca o usuário pelo e-mail
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  // Compara a senha digitada com a do banco (criptografada)
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  // Gera um token JWT com o ID do usuário
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h", // Token expira em 1 hora
    }
  );

  // Envia o token como resposta
  res.json({ token });
};
