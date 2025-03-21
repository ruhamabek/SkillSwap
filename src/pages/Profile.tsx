
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, MessageSquare, Share, Star, Users, BookOpen, ArrowRight, 
  Calendar, Check, Clock, Zap, User, MapPin, GraduationCap 
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SkillCard from '@/components/SkillCard';

const Profile = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock user data
  const user = {
    name: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&crop=faces&auto=format&dpr=1',
    title: 'Computer Science Student',
    location: 'San Francisco, CA',
    university: 'Stanford University',
    bio: 'Passionate about technology and education. I love to learn new things and share my knowledge with others. Currently focusing on machine learning and data visualization.',
    joinDate: 'May 2023',
    rating: 4.8,
    reviewCount: 24,
    completedExchanges: 15,
    teaches: [
      { name: 'Python Programming', level: 'Advanced' },
      { name: 'Machine Learning', level: 'Intermediate' },
      { name: 'Data Visualization', level: 'Advanced' },
      { name: 'SQL Databases', level: 'Intermediate' }
    ],
    learns: [
      { name: 'UX Design', level: 'Beginner' },
      { name: 'Public Speaking', level: 'Beginner' },
      { name: 'Web Development', level: 'Intermediate' }
    ],
    availability: [
      { day: 'Monday', times: ['6:00 PM - 8:00 PM'] },
      { day: 'Wednesday', times: ['7:00 PM - 9:00 PM'] },
      { day: 'Saturday', times: ['10:00 AM - 12:00 PM', '2:00 PM - 4:00 PM'] }
    ]
  };

  // Mock skill exchange history
  const exchanges = [
    {
      id: '1',
      partner: {
        name: 'Jamie Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&crop=faces&auto=format&dpr=1'
      },
      taught: 'Python Programming',
      learned: 'UI Design',
      duration: '6 weeks',
      status: 'Completed',
      date: 'Mar 2023 - Apr 2023'
    },
    {
      id: '2',
      partner: {
        name: 'Taylor Reed',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&crop=faces&auto=format&dpr=1'
      },
      taught: 'Data Visualization',
      learned: 'Content Creation',
      duration: '4 weeks',
      status: 'Completed',
      date: 'Jan 2023 - Feb 2023'
    },
    {
      id: '3',
      partner: {
        name: 'Jordan Patel',
        avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&crop=faces&auto=format&dpr=1'
      },
      taught: 'SQL Databases',
      learned: 'Public Speaking',
      duration: '8 weeks',
      status: 'Active',
      date: 'Jun 2023 - Present'
    }
  ];

  // Recommendations based on skills
  const recommendations = [
    {
      id: '1',
      name: 'UX Research Methods',
      category: 'Design',
      level: 'Beginner' as const,
      duration: '4 weeks',
      rating: 4.7,
      students: 89,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    },
    {
      id: '2',
      name: 'Public Speaking Essentials',
      category: 'Communication',
      level: 'Beginner' as const,
      duration: '3 weeks',
      rating: 4.6,
      students: 112,
    },
    {
      id: '3',
      name: 'Web Development Fundamentals',
      category: 'Programming',
      level: 'Intermediate' as const,
      duration: '6 weeks',
      rating: 4.8,
      students: 156,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex flex-col items-center md:items-start">
              <Avatar className="h-32 w-32 border-4 border-border">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-3xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" className="gap-2">
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
                <Button variant="outline" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-grow md:border-l md:pl-8 md:border-border">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="text-muted-foreground">{user.title}</p>
                </div>
                <Button variant="outline" className="mt-2 md:mt-0 gap-2">
                  <Edit className="h-4 w-4" /> Edit Profile
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <span>{user.university}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{user.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>Joined {user.joinDate}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(user.rating) ? "text-amber-500 fill-amber-500" : "text-muted"}`} 
                      />
                    ))}
                  </div>
                  <span className="font-medium">{user.rating}</span>
                  <span className="text-muted-foreground text-sm">({user.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Zap className="h-5 w-5 text-primary" />
                  <span className="font-medium">{user.completedExchanges}</span>
                  <span className="text-muted-foreground text-sm">exchanges completed</span>
                </div>
              </div>
              
              <p className="text-muted-foreground">{user.bio}</p>
            </div>
          </div>
          
          {/* Main Content */}
          <Tabs defaultValue="skills">
            <TabsList className="mb-8">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="recommendations">For You</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills I Teach */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" /> 
                      Skills I Teach
                    </CardTitle>
                    <CardDescription>Skills I can share with others</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.teaches.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                          <div>
                            <div className="font-medium">{skill.name}</div>
                            <div className="text-sm text-muted-foreground">Level: {skill.level}</div>
                          </div>
                          <Badge variant={skill.level === 'Advanced' ? 'default' : 'secondary'}>
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
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
                    <div className="space-y-4">
                      {user.learns.map((skill, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                          <div>
                            <div className="font-medium">{skill.name}</div>
                            <div className="text-sm text-muted-foreground">Level: {skill.level}</div>
                          </div>
                          <Badge variant="outline">
                            {skill.level}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Add Learning Goal
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="exchanges" className="mt-0">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Skill Exchange History</h3>
                
                <div className="space-y-4">
                  {exchanges.map((exchange) => (
                    <Card key={exchange.id} className="overflow-hidden">
                      <div className={`h-1.5 w-full ${exchange.status === 'Completed' ? 'bg-green-500' : 'bg-primary'}`}></div>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex gap-4">
                            <Avatar>
                              <AvatarImage src={exchange.partner.avatar} alt={exchange.partner.name} />
                              <AvatarFallback>
                                {exchange.partner.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div>
                              <div className="font-medium">{exchange.partner.name}</div>
                              <div className="text-sm text-muted-foreground">{exchange.date}</div>
                              <div className="flex items-center mt-2">
                                <Badge variant="outline" className="mr-2">
                                  {exchange.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  <Clock className="inline h-3 w-3 mr-1" />
                                  {exchange.duration}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1">
                            <div className="flex items-center text-sm">
                              <span className="text-muted-foreground mr-2">Taught:</span>
                              <Badge variant="secondary" className="font-normal">
                                {exchange.taught}
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm">
                              <span className="text-muted-foreground mr-2">Learned:</span>
                              <Badge variant="outline" className="font-normal">
                                {exchange.learned}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" /> Message
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Button variant="outline">View All Exchanges</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule" className="mt-0">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Availability Schedule</h3>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" /> 
                      Weekly Availability
                    </CardTitle>
                    <CardDescription>Times when I'm available for skill exchanges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {user.availability.map((slot, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="font-medium mb-2">{slot.day}</div>
                          <div className="space-y-2">
                            {slot.times.map((time, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>{time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="border border-dashed rounded-md p-4 flex items-center justify-center">
                        <Button variant="ghost" className="h-full w-full">
                          <span className="flex flex-col items-center">
                            <Plus className="h-6 w-6 mb-1" />
                            Add Time Slot
                          </span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Update Schedule
                    </Button>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>Your scheduled skill exchange sessions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={exchanges[2].partner.avatar} alt={exchanges[2].partner.name} />
                            <AvatarFallback>
                              {exchanges[2].partner.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{exchanges[2].partner.name}</div>
                            <div className="text-sm text-muted-foreground">SQL Databases Session</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Tomorrow</div>
                          <div className="text-sm text-muted-foreground">7:00 PM - 9:00 PM</div>
                        </div>
                      </div>
                      
                      <div className="text-center py-6 border rounded-md">
                        <p className="text-muted-foreground">No other upcoming sessions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-0">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold mb-4">Recommended For You</h3>
                <p className="text-muted-foreground mb-6">
                  Based on your learning interests, we've found these skills and mentors for you.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium">Skills You Might Like</h4>
                      <Button variant="link" className="gap-1" asChild>
                        <a href="/browse">
                          View All <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {recommendations.map((skill) => (
                        <SkillCard key={skill.id} skill={skill} />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium">Perfect Matches</h4>
                      <Button variant="link" className="gap-1" asChild>
                        <a href="/browse">
                          View All <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          {[1, 2].map((_, index) => (
                            <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage 
                                    src={`https://images.unsplash.com/photo-1580489944761-15a19d6${index + 54956}?w=150&h=150&crop=faces&auto=format&dpr=1`} 
                                  />
                                  <AvatarFallback>
                                    {index === 0 ? 'JD' : 'MS'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{index === 0 ? 'Jordan Davis' : 'Mia Smith'}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {index === 0 ? 'UX Design Student' : 'Web Development Student'}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge variant="outline" className="mb-1">
                                  91% Match
                                </Badge>
                                <Button size="sm">Connect</Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Plus icon component since we haven't imported it
const Plus = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export default Profile;
