import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, Star, Users } from "lucide-react";
import Payment from "../api/paymentApi";

interface SkillCardProps {
  skill: {
    id: string;
    name: string;
    category: string;
    level: "Beginner" | "Intermediate" | "Advanced";
    duration: string;
    rating: number;
    checkout?: number;
    students: number;
    image?: string;
    color?: string;
  };
  className?: string;
}

const SkillCard = ({ skill, className }: SkillCardProps) => {
  const { paymentMutation } = Payment();
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-blue-100 text-blue-800";
      case "Advanced":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Programming: "bg-skill-python text-white",
      Design: "bg-skill-design text-white",
      Music: "bg-skill-music text-white",
      Writing: "bg-skill-writing text-white",
      Photography: "bg-skill-photo text-white",
      Marketing: "bg-skill-marketing text-white",
      JavaScript: "bg-skill-javascript text-black",
    };

    return colors[category] || "bg-skill-default text-white";
  };
  const datas = {
    id: 10,
    amount: 100,
    email: "teshx@gmail.com",
    first_name: "teshx",
    last_name: "habtie",
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await paymentMutation.mutateAsync(datas);

    if (typeof response === "string") {
      window.location.href = response; // Redirect if response is a URL
    } else {
      console.error("Invalid response:", response);
    }
  };

  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <div className="aspect-video relative overflow-hidden">
        {skill.image ? (
          <img
            src={skill.image}
            alt={skill.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full flex items-center justify-center",
              skill.color || "bg-gradient-to-br from-primary/80 to-secondary/80"
            )}
          >
            <span className="text-xl font-bold text-white">
              {skill.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
        )}
        <Badge
          className={cn(
            "absolute top-3 left-3 border-0",
            getCategoryColor(skill.category)
          )}
        >
          {skill.category}
        </Badge>
      </div>

      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">
          {skill.name}
        </h3>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge
            variant="outline"
            className={cn("font-normal", getLevelColor(skill.level))}
          >
            {skill.level}
          </Badge>

          <div className="flex items-center text-xs text-muted-foreground gap-1">
            <Clock className="h-3 w-3" />
            <span>{skill.duration}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium ml-1">{skill.rating}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium ml-1">{skill.students}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {!skill.checkout ? (
          <Button variant="secondary" className="w-full">
            Request Exchange
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={handleSubmit}
            className="w-full"
          >
            pay
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SkillCard;
