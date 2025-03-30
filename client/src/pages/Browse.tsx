import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkillCard from "@/components/SkillCard";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  BookOpen,
  Monitor,
  Music,
  Palette,
  Camera,
  PenTool,
  Database,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// this is data to check out
const skillsData1 = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    category: "JavaScript",
    level: "Beginner" as const,
    duration: "6 weeks",
    rating: 4.8,
    checkout: 10,
    students: 128,
    image: "https://images.unsplash.com/photo-1581091870621-3f7a3a6a5d3c",
  },
  {
    id: "2",
    name: "UX Research Methods",
    category: "Design",
    level: "Intermediate" as const,
    duration: "4 weeks",
    rating: 4.7,
    checkout: 10,
    students: 89,
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
  },
  {
    id: "3",
    name: "Python for Data Science",
    category: "Programming",
    level: "Advanced" as const,
    duration: "8 weeks",
    rating: 4.9,
    checkout: 10,
    students: 215,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
  },
];
// Sample data for skills
const skillsData = [
  {
    id: "1",
    name: "JavaScript Fundamentals",
    category: "JavaScript",
    level: "Beginner" as const,
    duration: "6 weeks",
    rating: 4.8,
    students: 128,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
  },
  {
    id: "2",
    name: "UX Research Methods",
    category: "Design",
    level: "Intermediate" as const,
    duration: "4 weeks",
    rating: 4.7,
    students: 89,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
  {
    id: "3",
    name: "Python for Data Science",
    category: "Programming",
    level: "Advanced" as const,
    duration: "8 weeks",
    rating: 4.9,
    students: 215,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
  },
  {
    id: "4",
    name: "Mobile Photography",
    category: "Photography",
    level: "Beginner" as const,
    duration: "3 weeks",
    rating: 4.6,
    students: 93,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
  },
  {
    id: "5",
    name: "Graphic Design Basics",
    category: "Design",
    level: "Beginner" as const,
    duration: "5 weeks",
    rating: 4.5,
    students: 178,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: "6",
    name: "SEO & Digital Marketing",
    category: "Marketing",
    level: "Intermediate" as const,
    duration: "6 weeks",
    rating: 4.7,
    students: 145,
  },
  {
    id: "7",
    name: "Music Production",
    category: "Music",
    level: "Intermediate" as const,
    duration: "8 weeks",
    rating: 4.8,
    students: 67,
  },
  {
    id: "8",
    name: "Creative Writing",
    category: "Writing",
    level: "Beginner" as const,
    duration: "4 weeks",
    rating: 4.6,
    students: 112,
  },
  {
    id: "9",
    name: "SQL for Data Analysis",
    category: "Programming",
    level: "Advanced" as const,
    duration: "5 weeks",
    rating: 4.9,
    students: 203,
  },
];

// Sample data for profiles
const profilesData = [
  {
    id: "1",
    name: "Alex Morgan",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&crop=faces&auto=format&dpr=1",
    title: "Computer Science Student",
    teaches: ["Python", "Machine Learning", "Data Visualization"],
    learns: ["UX Design", "Public Speaking"],
    rating: 4.8,
    reviews: 24,
    university: "Stanford University",
  },
  {
    id: "2",
    name: "Jamie Chen",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&crop=faces&auto=format&dpr=1",
    title: "Design Student",
    teaches: ["UI Design", "Figma", "Design Systems"],
    learns: ["JavaScript", "React", "Vue.js"],
    rating: 4.7,
    reviews: 18,
    university: "RISD",
  },
  {
    id: "3",
    name: "Taylor Reed",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&crop=faces&auto=format&dpr=1",
    title: "Marketing Student",
    teaches: ["Social Media Marketing", "Content Strategy", "SEO"],
    learns: ["Video Editing", "Data Analysis"],
    rating: 4.9,
    reviews: 32,
    university: "NYU",
  },
  {
    id: "4",
    name: "Jordan Patel",
    avatar:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=150&h=150&crop=faces&auto=format&dpr=1",
    title: "Music Production Student",
    teaches: ["Music Production", "Sound Design", "Audio Engineering"],
    learns: ["Marketing", "Graphic Design"],
    rating: 4.6,
    reviews: 15,
    university: "Berklee College of Music",
  },
  {
    id: "5",
    name: "Morgan Smith",
    title: "Photography Student",
    teaches: ["Photography", "Photo Editing", "Lightroom"],
    learns: ["Web Development", "Digital Marketing"],
    rating: 4.5,
    reviews: 12,
    university: "SVA",
  },
  {
    id: "6",
    name: "Casey Johnson",
    title: "English Literature Student",
    teaches: ["Creative Writing", "Editing", "Content Creation"],
    learns: ["Graphic Design", "Photography"],
    rating: 4.7,
    reviews: 20,
    university: "Columbia University",
  },
];

// Category icons mapping
const categoryIcons = {
  Programming: <Monitor className="h-5 w-5" />,
  Design: <Palette className="h-5 w-5" />,
  Marketing: <BookOpen className="h-5 w-5" />,
  Music: <Music className="h-5 w-5" />,
  Photography: <Camera className="h-5 w-5" />,
  Writing: <PenTool className="h-5 w-5" />,
  Data: <Database className="h-5 w-5" />,
};

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  const filterCategories = [
    "Programming",
    "Design",
    "Marketing",
    "Music",
    "Photography",
    "Writing",
    "Data",
  ];

  const levelFilters = ["Beginner", "Intermediate", "Advanced"];

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "rating", label: "Highest Rated" },
    { value: "recent", label: "Recently Added" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="heading-2 mb-4">Browse Skills & Mentors</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect skill to learn or a mentor to connect with. Use
              filters to narrow down your search.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search skills, topics, or mentors..."
                  className="pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 md:w-auto">
                <Select defaultValue="popular">
                  <SelectTrigger className="w-[160px] h-11">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className="h-11 w-11"
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className="h-11 w-11"
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="mt-4">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                  <Filter className="h-4 w-4" /> Filters:
                </span>

                {filterCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={
                      activeFilters.includes(category) ? "default" : "outline"
                    }
                    className="cursor-pointer gap-1"
                    onClick={() => toggleFilter(category)}
                  >
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    {category}
                  </Badge>
                ))}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  More Filters <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="mentors">Mentors</TabsTrigger>
            </TabsList>

            <TabsContent value="skills" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillsData1.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="skills" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillsData.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="mentors" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profilesData.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
