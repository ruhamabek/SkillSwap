import { Request, Response } from "express";
import mongoose from "mongoose";
import Profile from "../model/profile";  // The model for your Profile collection
import { ObjectId } from "mongodb";
import { client } from "../db/mongo-client"; 
// MongoDB client setup for session database

const db = client.db("SkillSwap"); // The session database name
const sessionsCollection = db.collection("session");  // The session collection name

// Function to get profile based on sessionId
const getProfile = async (req: Request, res: Response) => {
  try {
    // Retrieve the sessionId from the request header (e.g., from a Bearer token or cookie)
    const sessionId = req.headers["session-id"] as string; // Assuming sessionId is in headers
    
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Find the session in the session collection
    const session = await sessionsCollection.findOne({ _id: new ObjectId(sessionId) });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Retrieve the userId from the session
    const { userId } = session;

    // Now that we have the userId, fetch the user profile from the Profile collection
    const profile = await Profile.findOne({ _id: userId });

    if (!profile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Return the profile if found
    res.json(profile);

  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};




export { getProfile };
