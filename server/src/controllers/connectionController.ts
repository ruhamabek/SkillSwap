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


export default {
  getPendingCount,
  getConnections,
  respondToRequest,
  requestToconnect,
  getacceptedConnections,
  getacceptedbyConnections,
};
