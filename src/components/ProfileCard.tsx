
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    teaches: string[];
    learns: string[];
    rating: number;
    reviews: number;
    university?: string;
  };
  className?: string;
}

const ProfileCard = ({ profile, className }: ProfileCardProps) => {
  return (
    <Card className={cn("overflow-hidden card-hover", className)}>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="text-lg font-semibold mt-3">{profile.name}</h3>
          <p className="text-sm text-muted-foreground">{profile.title}</p>
          
          {profile.university && (
            <Badge variant="outline" className="mt-2">
              {profile.university}
            </Badge>
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
              ({profile.reviews})
            </span>
          </div>
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Teaches:</h4>
            <div className="flex flex-wrap gap-1">
              {profile.teaches.map((skill, index) => (
                <Badge key={index} variant="secondary" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Wants to Learn:</h4>
            <div className="flex flex-wrap gap-1">
              {profile.learns.map((skill, index) => (
                <Badge key={index} variant="outline" className="font-normal">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button variant="default" className="w-full">Connect</Button>
        <Button variant="outline" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
