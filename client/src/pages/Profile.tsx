import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Edit,
  MessageSquare,
  Share,
  Star,
  Users,
  BookOpen,
  ArrowRight,
  Calendar,
  Check,
  Clock,
  Zap,
  User,
  MapPin,
  GraduationCap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useNavigate } from "react-router-dom";
import useProfile from "@/api/ProfileApi";

const Profile = () => {
  const { profile } = useProfile();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const user = {
    name: session.user.name,
    avatar: profile?.image,
    title: profile?.title,
    location: profile?.location,
    university: profile?.university,
    bio: profile?.bio,
    joinDate: session.user.createdAt,
    rating: 4.8,
    reviewCount: 24,
    completedExchanges: 15,
    teaches: profile?.skillsToTeach,
    learns: profile?.skillsToLearn,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Profile Picture and Actions */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <div className="mb-4">
                  <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-primary shadow-lg"
                  />
                </div>
                <div
                  className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-md cursor-pointer"
                  onClick={() => navigate("/profile-setup")}
                >
                  <Edit className="h-5 w-5" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="gap-2 px-4 py-2 shadow-md"
                  onClick={() => navigate("/connections")}
                >
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 px-4 py-2 shadow-md"
                  onClick={() => navigate("/profile-setup")}
                >
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </div>
            {/* Profile Details */}
            <div className="flex-grow md:border-l md:pl-8 md:border-border">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h1 className="text-4xl font-extrabold">{user.name}</h1>
                  <p className="text-muted-foreground text-lg">{user.title}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{user.university}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(user.rating)
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-medium">{user.rating}</span>
                  <span className="text-muted-foreground text-sm">
                    ({user.reviewCount} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="text-lg font-medium">
                    {user.completedExchanges}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    exchanges completed
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills I Teach */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Skills I Teach
                </CardTitle>
                <CardDescription>
                  Skills I can share with others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.teaches?.length > 0 ? (
                    user.teaches?.map((skill, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                      >
                        <div className="font-medium">{skill}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No skills added yet.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate("/profile-setup")}
                >
                  Add New Skill
                </Button>
              </CardFooter>
            </Card>

            {/* Skills I Want to Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Skills I Want to Learn
                </CardTitle>
                <CardDescription>Skills I'm looking to develop</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.learns?.length > 0 ? (
                    user.learns?.map((skill, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-md"
                      >
                        <div className="font-medium">{skill}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">
                      No skills added yet.
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="secondary"
                  className="w-full bg-primary text-white hover:bg-primary/90"
                  onClick={() => navigate("/profile-setup")}
                >
                  Add New Skill
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
