// src/server.ts
import express from "express";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware para entender JSON
app.use(express.json());

// Todas as rotas de auth ficam em /auth
app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta ${PORT} 🚀");
});
