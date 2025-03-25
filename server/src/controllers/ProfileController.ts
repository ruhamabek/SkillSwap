import { ObjectId } from 'mongodb';
import { auth } from "../lib/auth";
import Profile from '../model/profile';

import { Request, Response } from 'express';

const getProfile = async (req: Request, res: Response) => {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: req.headers,
    });

    // Handle session not found or invalid
    if (!sessionResponse?.session) {
      return res.status(401).json({ message: "Unauthorized - Invalid session" });
    }

    // Destructure the needed values from the session
    const { session: { id: sessionId } } = sessionResponse;
    const {user} = sessionResponse;
    // Ensure user information exists in the session
    if (!user?.id) {
      return res.status(401).json({ message: "Malformed session data" });
    }

    // Convert to ObjectId if needed (check your BetterAuth user ID format)
    const userId = new ObjectId(user.id);

    // Fetch profile with proper type casting
    const profile = await Profile.findOne({ _id: userId }).lean();

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Return only public-facing fields
    const safeProfile = {
      title: profile.title,
      bio: profile.bio,
      university: profile.university,
      location: profile.location,
      skills: {
        teaching: profile.skillsToTeach,
        learning: profile.skillsToLearn
      }
    };

    res.json(safeProfile);

  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createProfile = async (req: Request, res: Response) => {
  try {
    const sessionResponse = await auth.api.getSession({
      headers: req.headers,
    });

    if (!sessionResponse?.session) {
      return res.status(401).json({ message: "Unauthorized - Invalid session" });
    }

    
    const {user} = sessionResponse;
    
    if (!user?.id) {
      return res.status(401).json({ message: "Malformed session data" });
    }

    // Check for existing profile first
    const existingProfile = await Profile.findOne({ _id: new ObjectId(user.id) });
    if (existingProfile) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    // Validate request body
    const { title, bio, university, location, teachSkills, learnSkills } = req.body;
    
    if (!title?.trim() || !bio?.trim()) {
      return res.status(400).json({ message: "Title and bio are required" });
    }

    if (!Array.isArray(teachSkills) || !Array.isArray(learnSkills)) {
      return res.status(400).json({ message: "Skills must be arrays" });
    }

    // Create new profile with validation
    const newProfile = new Profile({
      _id: new ObjectId(user.id),
      title: title.trim(),
      bio: bio.trim(),
      university: university?.trim() || undefined,
      location: location?.trim() || undefined,
      teachSkills: teachSkills.slice(0, 10), // Limit to 10 skills
      learnSkills: learnSkills.slice(0, 10),
      createdAt: new Date(),
    });

    await newProfile.save();

    // Return created profile without internal fields
    const { _id, ...responseProfile } = newProfile.toObject();
    res.status(201).json(responseProfile);

  } catch (error) {
    console.error("Error creating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};