import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connect as authConnect} from "./db/mongo-client";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import {connect as dbConnect} from "./db/mongoose"
import profileRoute from "../src/routes/profileRoute";

const app = express();
const PORT = 3000;

app.use(
    cors({
      origin: "http://localhost:8080", 
      methods: ["GET", "POST", "PUT", "DELETE"], 
      credentials: true,
    })
  );
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "health OK!" });
});

app.use("/profile" , profileRoute);

async function startServer() {
  try {
    await authConnect();
    await dbConnect();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to connect to the database. Server not started.",
      error
    );
    process.exit(1);
  }
}

startServer();


