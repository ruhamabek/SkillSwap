import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import payments from "@/api/connectionApi";
import Header from "@/components/Header";

export default function ConnectionsPage() {
  const [requests, setRequests] = useState([]);
  const [accepted, setAccepted] = useState([]);
  const [acceptedBy, setAcceptedBy] = useState([]);
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  const {
    getALLconnectMutation,
    responseMutation,
    getALLacceptedconnectMutation,
    getALLacceptedbyconnectMutation,
  } = payments();

  const fetchAllConnections = async () => {
    try {
      const [pendingRes, acceptedRes, acceptedByRes] = await Promise.all([
        getALLconnectMutation.mutateAsync(),
        getALLacceptedconnectMutation.mutateAsync(),
        getALLacceptedbyconnectMutation.mutateAsync(),
      ]);

      setRequests(pendingRes);
      setAccepted(acceptedRes);
      setAcceptedBy(acceptedByRes);
    } catch (error) {
      console.error("Error fetching connections:", error);
      toast.error("Failed to load connections");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllConnections();
    }
  }, [userId]);

  const handleRespond = async (senderId: string, action: string) => {
    try {
      await responseMutation.mutateAsync({ senderId, action });
      toast.success(`Request ${action}ed successfully`);
      fetchAllConnections();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
      console.error("Response error:", error);
    }
  };

  const ConnectionCard = ({ connection, type, display, image }) => {
    const user =
      type === "request"
        ? connection.sender
        : type === "accepted"
        ? connection.sender
        : connection.receiver;

    return (
      <div
        key={connection._id}
        className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={image} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">
                {user.title || "HI"}
              </p>
            </div>
          </div>
          {type === "request" ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleRespond(connection.sender, "accept")}
              >
                Accept
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRespond(connection.sender, "reject")}
              >
                Reject
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button asChild size="icon" className="rounded-full">
                <Link to={`/chat/${user}`}>💬</Link>
              </Button>
              {!display ? (
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleRespond(connection.sender, "complete")}
                >
                  X
                </Button>
              ) : (
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => handleRespond(connection.receiver, "complete")}
                >
                  X
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Header />
      <h1 className="text-2xl font-bold mb-5 mt-10">Connections</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Pending Requests Column */}
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Pending Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No pending requests
            </p>
          ) : (
            requests.map((request) => (
              <ConnectionCard
                key={request._id}
                connection={request}
                image={request.images}
                display={false}
                type="request"
              />
            ))
          )}
        </div>
        {/* Accepted Connections Column */}
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Your Connections</h2>
          {accepted.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No connections yet</p>
          ) : (
            accepted.map((conn) => (
              <ConnectionCard
                key={conn._id}
                connection={conn}
                image={conn.images}
                display={false}
                type="accepted"
              />
            ))
          )}
        </div>
        {/* //  Accepted By Others Column */}
        <div className="bg-white/50 backdrop-blur-sm p-4 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Accepted By Others</h2>
          {acceptedBy.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No acceptances yet</p>
          ) : (
            acceptedBy.map((conn) => (
              <ConnectionCard
                key={conn._id}
                connection={conn}
                image={conn.images}
                display={true}
                type="acceptedBy"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
