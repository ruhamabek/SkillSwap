import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connect as connectAppDB } from "../src/db/mongoose";


const app = express();
const PORT = 4000;

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());



app.get("/", (req: Request, res: Response) => {
  res.send("Application Server Running!");
});

async function startAppServer() {
  try {
    await connectAppDB();
    app.listen(PORT, () => {
      console.log(`✅ App server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Application DB connection failed:", error);
    process.exit(1);
  }
}

startAppServer();
