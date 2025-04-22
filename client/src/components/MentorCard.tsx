import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";

interface MentorCardProps {
  profile: {
    id: string;
    name: string;
    title: string;
    teaches: string[];
    learns: string[];
    rating: number;
    reviews: number;
    university?: string;
    location?: string;
    bio?: string;
    isPremium?: boolean;
    image: string;
  };
  isLoading: boolean;
  onConnect: (id: string, image: string) => void;
  onSubmit: (e: React.FormEvent, id: string) => void;
  className?: string;
}

const MentorCard = ({
  profile,
  isLoading,
  onConnect,
  onSubmit,
  className,
}: MentorCardProps) => {
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  return (
    <Card
      className={cn(
        "overflow-hidden card-hover h-full flex flex-col",
        className
      )}
    >
      {profile.isPremium && (
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold py-1 px-3 flex items-center">
          <Zap className="h-3 w-3 mr-1" />
          PREMIUM MENTOR
        </div>
      )}

      <CardContent className="pt-6 flex-grow">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-border mb-4">
            {profile.image ? (
              <img
                src={profile.image}
                alt={profile.name || "Mentor"}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>

          <h3 className="text-lg font-semibold">
            {profile.name || "Anonymous"}
          </h3>

          {profile.university && (
            <p className="text-sm text-muted-foreground mt-1">
              {profile.university}
            </p>
          )}

          {profile.location && (
            <p className="text-xs text-muted-foreground mt-1">
              {profile.location}
            </p>
          )}

          <div className="flex items-center gap-1 mt-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < Math.floor(profile.rating)
                      ? "text-amber-500 fill-amber-500"
                      : "text-muted"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground ml-1">
              ({profile.reviews} reviews)
            </span>
          </div>
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
            {profile.bio}
          </p>
        )}

        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Teaches:</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {profile.teaches.length > 0 ? (
                profile.teaches.map((skill, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="font-normal"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  No skills listed
                </span>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Wants to Learn:</h4>
            <div className="flex flex-wrap gap-1 justify-center">
              {profile.learns.length > 0 ? (
                profile.learns.map((skill, index) => (
                  <Badge key={index} variant="outline" className="font-normal">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">
                  No skills listed
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        {profile.isPremium ? (
          <form onSubmit={(e) => onSubmit(e, profile.id)} className="w-full">
            <Button
              type="submit"
              variant="default"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Upgrade ($100)"}
            </Button>
          </form>
        ) : (
          <Button
            variant="default"
            className="w-full"
            onClick={() =>
              session
                ? onConnect(profile.id, profile.image)
                : navigate("/sign-up")
            }
          >
            Request Connection
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MentorCard;
