
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Search, Filter, LayoutGrid, List } from 'lucide-react';
import ProfileCard from './ProfileCard';
import SkillCard from './SkillCard';
import { Link } from 'react-router-dom';

// Sample data
const popularSkills = [
  'Python', 'JavaScript', 'UI/UX Design', 'Digital Marketing', 
  'Creative Writing', 'Data Science', 'Machine Learning',
  'Photography', 'Video Editing', 'Public Speaking'
];

const featuredSkills = [
  {
    id: '1',
    name: 'JavaScript Fundamentals',
    category: 'JavaScript',
    level: 'Beginner' as const,
    duration: '6 weeks',
    rating: 4.8,
    students: 128,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    color: 'bg-skill-javascript',
  },
  {
    id: '2',
    name: 'UX Research Methods',
    category: 'Design',
    level: 'Intermediate' as const,
    duration: '4 weeks',
    rating: 4.7,
    students: 89,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    color: 'bg-skill-design',
  },
  {
    id: '3',
    name: 'Python for Data Science',
    category: 'Programming',
    level: 'Advanced' as const,
    duration: '8 weeks',
    rating: 4.9,
    students: 215,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    color: 'bg-skill-python',
  },
];

const featuredProfiles = [
  {
    id: '1',
    name: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&crop=faces&auto=format&dpr=1',
    title: 'Computer Science Student',
    teaches: ['Python', 'Machine Learning', 'Data Visualization'],
    learns: ['UX Design', 'Public Speaking'],
    rating: 4.8,
    reviews: 24,
    university: 'Stanford University',
  },
  {
    id: '2',
    name: 'Jamie Chen',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&crop=faces&auto=format&dpr=1',
    title: 'Design Student',
    teaches: ['UI Design', 'Figma', 'Design Systems'],
    learns: ['JavaScript', 'React', 'Vue.js'],
    rating: 4.7,
    reviews: 18,
    university: 'RISD',
  },
  {
    id: '3',
    name: 'Taylor Reed',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&crop=faces&auto=format&dpr=1',
    title: 'Marketing Student',
    teaches: ['Social Media Marketing', 'Content Strategy', 'SEO'],
    learns: ['Video Editing', 'Data Analysis'],
    rating: 4.9,
    reviews: 32,
    university: 'NYU',
  },
];

const MatchSection = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  return (
    <section className="py-16 px-6 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="heading-2 mb-4">Find Your Perfect Skill Match</h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover skills to learn or share your expertise with others.
          Our matching system connects you with the right people.
        </p>
      </div>
      
      <div className="mb-12 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 md:gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search for skills or mentors..." 
              className="pl-10 h-12 md:h-11 rounded-lg"
            />
          </div>
          <Button variant="outline" className="h-12 md:h-11 gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {popularSkills.slice(0, 8).map((skill, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-secondary hover:text-white transition-colors"
            >
              {skill}
            </Badge>
          ))}
          <Badge variant="outline" className="cursor-pointer">
            + More
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="skills" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="skills" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="mentors" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 text-center">
        <Button asChild size="lg" className="gap-2">
          <Link to="/browse">
            Browse All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default MatchSection;
