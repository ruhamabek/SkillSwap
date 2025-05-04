import { Server } from "socket.io";
import mongoose from "mongoose";
import Profile from "../model/profile";
import { ConversationModel, MessageModel } from "../model/ConversationModel";

export default function socketHandler(server: any) {
  const onlineUsers = new Map<string, string>();
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: 2 * 60 * 1000,
      skipMiddlewares: true,
    },
  });

  io.on("connection", async (socket) => {
    console.log("🔥 New connection:", socket.id);

    const userId = socket.handshake.query.userid as string;
    console.log("User ID: sender", userId);

    try {
      // Validate user ID format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
      }

      socket.join(userId);
      onlineUsers.set(socket.id, userId);
      io.emit("onlineUser", Array.from(onlineUsers));

      socket.on("message", async (id: string) => {
        try {
          if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid target user ID");
          }

          const userdetails = await Profile.findOne({ userid: id });
          if (!userdetails) {
            throw new Error("User not found");
          }

          const conversation = await ConversationModel.findOne({
            $or: [
              { 
                sender: new mongoose.Types.ObjectId(userId), 
                receiver: new mongoose.Types.ObjectId(id) 
              },
              { 
                sender: new mongoose.Types.ObjectId(id), 
                receiver: new mongoose.Types.ObjectId(userId) 
              }
            ]
          })
          .populate({
            path: "messages",
            select: "text imageUrl videoUrl codeContent codeLanguage msgByUserId createdAt"
          })
          .sort({ updatedAt: -1 })
          .lean();

          socket.emit("userDetails", userdetails.toObject());
          socket.emit("message", conversation?.messages || []);

        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          socket.emit("error", message);
        }
      });

      socket.on("new message", async (data) => {
        try {
          // Validate required fields
          if (!data.sender || !data.receiver) {
            throw new Error("Missing sender/receiver in message data");
          }

          // Find or create conversation
          const conversation = await ConversationModel.findOneAndUpdate(
            {
              $or: [
                { sender: data.sender, receiver: data.receiver },
                { sender: data.receiver, receiver: data.sender },
              ]
            },
            {
              $setOnInsert: {
                sender: data.sender,
                receiver: data.receiver,
              }
            },
            {
              upsert: true,
              new: true,
              setDefaultsOnInsert: true
            }
          );

          // Create and save message
          const message = await MessageModel.create({
            text: data.text,
            imageUrl: data.imageUrl,
            videoUrl: data.videoUrl,
            codeContent: data.codeContent,
            codeLanguage: data.codeLanguage,
            msgByUserId: data.msgByUserId,
          });

          // Update conversation with new message
          await ConversationModel.findByIdAndUpdate(
            conversation._id,
            { $push: { messages: message._id } }
          );

          // Get updated conversation
          const updatedConversation = await ConversationModel.findById(conversation._id)
            .populate({
              path: "messages",
              select: "text imageUrl videoUrl codeContent codeLanguage msgByUserId createdAt"
            })
            .lean();

          // Emit to both parties
          io.to(data.sender).emit("message", updatedConversation?.messages || []);
          io.to(data.receiver).emit("message", updatedConversation?.messages || []);

        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Message processing failed";
          socket.emit("message-error", message);
          console.error("Message error:", error);
        }
      });

      socket.on("disconnect", () => {
        onlineUsers.delete(socket.id);
        console.log("💀 Disconnected:", socket.id);
        io.emit("online_users", Array.from(onlineUsers.values()));
      });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Connection error";
      socket.emit("error", message);
      socket.disconnect(true);
    }
  });

  return io;
}