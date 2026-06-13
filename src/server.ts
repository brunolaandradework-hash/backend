import express from "express";
import cors from "cors";
import "dotenv/config";
import router from "./routes";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://frontend-six-mu-42.vercel.app",
    ],
  })
);
app.use(express.json());

app.use(router);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});