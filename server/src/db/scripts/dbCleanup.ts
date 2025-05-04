import mongoose from "mongoose";
import { ConversationModel, MessageModel } from "../../model/ConversationModel";

export async function cleanupDatabase() {
  try {
    const uri = "mongodb+srv://admin2:Love(mom2)@skillswap.z75ah.mongodb.net/?retryWrites=true&w=majority&appName=SkillSwap" // Use your Atlas URI
    await mongoose.connect(uri);

    // Delete messages and conversations
    await MessageModel.deleteMany({});
    await ConversationModel.deleteMany({});
    
    console.log("✅ Database cleaned successfully");
  } catch (err) {
    console.error("🚨 Cleanup error:", err);
    throw err;
  } finally {
    await mongoose.disconnect();
  }
}