import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      validate: {
        validator: (v: string) => {
          if (!v) return true; // Allow empty
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
        },
        message: "Invalid image URL format"
      }
    },
    videoUrl: {
      type: String,
      validate: {
        validator: (v: string) => {
          if (!v) return true; // Allow empty
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
        },
        message: "Invalid video URL format"
      }
    },
    // Add these new fields for code support
    codeContent: {
      type: String,
      default: "",
    },
    codeLanguage: {
      type: String,
      default: "javascript", // Default to JavaScript
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    receiver: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model("Message", messageSchema);
export const ConversationModel = mongoose.model(
  "Conversation",
  conversationSchema
);
