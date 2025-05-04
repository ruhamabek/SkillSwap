import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { authClient } from "@/lib/auth-client";

export default function useOnlineUsers() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    const socket = io("http://localhost:4000", {
      auth: { userId: session.user.id },
    });

    socket.on("online_users", (users: string[]) => {
      setOnlineUsers(new Set(users));
    });

    socket.on("user_connected", (userId: string) => {
      setOnlineUsers(prev => new Set([...prev, userId]));
    });

    socket.on("user_disconnected", (userId: string) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [session?.user?.id]);

  return onlineUsers;
}