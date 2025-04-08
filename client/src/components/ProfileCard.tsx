import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileCardProps {
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
  };
  className?: string;
}

const ProfileCard = ({ profile, className }: ProfileCardProps) => {
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <Card
      className={cn(
        "overflow-hidden card-hover h-full flex flex-col",
        className
      )}
    >
      <CardContent className="pt-6 flex-grow">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-border mb-4">
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
              {initials}
            </AvatarFallback>
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
        <Button variant="default" className="w-full">
          Connect
        </Button>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
