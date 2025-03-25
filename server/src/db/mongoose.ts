import mongoose from "mongoose";

const appDBUri = process.env.APP_DATABASE_URI as string; // Separate database URI

async function connect(): Promise<void> {
  try {
    await mongoose
    .connect(appDBUri as string)
    console.log("✅ Connected to Application MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to Application DB:", error);
    throw error;
  }
}

export { connect };
