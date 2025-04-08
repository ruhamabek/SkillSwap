import { Request, Response } from "express";
import ConnectionRequest from "../model/ConnectionRequest";

const getPendingCount = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const count = await ConnectionRequest.countDocuments({
      receiver: userId,
      status: "pending",
    });
    res.json({ count });
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
};

const getConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await ConnectionRequest.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "name title");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
const getacceptedConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await ConnectionRequest.find({
      receiver: userId,
      status: "accepted",
    }).populate("sender", "name title");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
const getacceptedbyConnections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const requests = await ConnectionRequest.find({
      sender: userId,
      status: "accepted",
    }).populate("sender", "name title");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

const respondToRequest = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params; // receiver
    const { senderId, action } = req.body; // sender and action ('accept' or 'reject')

    // Find the connection request
    const connectionRequest = await ConnectionRequest.findOne({
      sender: senderId,
      receiver: userId,
      status: "pending",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    if (action === "accept") {
      connectionRequest.status = "accepted";
      await connectionRequest.save();
    } else if (action === "reject") {
      await ConnectionRequest.findByIdAndDelete(connectionRequest._id);
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
const requestToconnect = async (req: Request, res: Response) => {
  const { userId } = req.params; // sender
  const { action } = req.body;

  // Check if a request already exists
  const existingRequest = await ConnectionRequest.findOne({
    sender: userId,
    receiver: action,
    status: "pending",
  });

  if (existingRequest) {
    return res.json({ message: "Request already sent." });
  }

  try {
    const newRequest = new ConnectionRequest({
      sender: userId,
      receiver: action,
      status: "pending",
    });

    await newRequest.save();
    res.json({
      message: "successfuly requested",
      success: true,
      request: newRequest,
    });
  } catch (error) {
    res.json({ error: (error as Error).message });
  }
};
export default {
  getPendingCount,
  getConnections,
  respondToRequest,
  requestToconnect,
  getacceptedConnections,
  getacceptedbyConnections,
};
