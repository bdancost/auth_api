import express from "express";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

// Aqui você "liga" suas rotas no app
app.use("/auth", authRoutes); // Isso cria: /auth/register e /auth/login

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
