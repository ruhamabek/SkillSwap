import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MentorCard from "@/components/MentorCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useProfile from "@/api/ProfileApi";
import { Search, Filter } from "lucide-react";
import { toast } from "sonner";
import Payment from "@/api/paymentApi";
import Payments from "@/api/connectionApi";

const Browse = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null); // Track which mentor is loading
  const { getALLProfileMutation } = useProfile();
  const { paymentMutation } = Payment();
  const { requestMutation, AskMutation } = Payments();

  // Your exact datas object
  const datas = {
    id: 10,
    amount: 100,
    email: "teshx@gmail.com",
    first_name: "teshx",
    last_name: "habtie",
  };
  // top rated mentors

  const topRatedMentors = [
    {
      _id: "67e84af37e8a80d7f7472a6b",
      title: "AI Research Scientist",
      university: "MIT",
      location: "Cambridge, USA",
      bio: "Expert in artificial intelligence, deep learning, and natural language processing with a focus on cutting-edge research.",
      skillsToTeach: ["Deep Learning", "NLP", "TensorFlow", "AI Ethics"],
      skillsToLearn: ["Cybersecurity", "Edge Computing"],
      userid: "67e83c087e8a80d7f7472a49",
      __v: 0,
    },
    {
      _id: "67e6026598c0ecb89bd9e362",
      title: "Cloud Solutions Architect",
      university: "University of California, Berkeley",
      location: "Berkeley, USA",
      bio: "Specialist in designing and implementing scalable cloud solutions with expertise in DevOps and microservices architecture.",
      skillsToTeach: ["AWS", "Docker", "Kubernetes", "Microservices"],
      skillsToLearn: ["AI", "Blockchain", "Rust"],
      userid: "67e09093bf5353b27aa67088",
      __v: 0,
    },
    {
      _id: "67e728da951e674f22b26fd2",
      title: "Frontend Developer",
      university: "Addis Ababa University",
      location: "Addis Ababa, Ethiopia",
      bio: "Frontend developer passionate about creating intuitive user interfaces and improving web accessibility.",
      skillsToTeach: ["React", "CSS", "JavaScript", "TypeScript"],
      skillsToLearn: ["Backend Development", "GraphQL", "Python"],
      userid: "67e07ddb5e53e6f949d25ac9",
      __v: 0,
    },
  ];

  //top rated are not editable
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProfiles = async () => {
      try {
        const response = await getALLProfileMutation.mutateAsync();
        setProfiles(response);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const getAllSkills = () => {
    const allSkills = new Set<string>();
    profiles.forEach((profile) => {
      (profile.skillsToTeach || []).forEach((skill: string) =>
        allSkills.add(skill)
      );
      (profile.skillsToLearn || []).forEach((skill: string) =>
        allSkills.add(skill)
      );
    });
    return Array.from(allSkills);
  };

  // Your exact handleSubmit function
  const handleSubmit = async (e: React.FormEvent, mentorId: string) => {
    e.preventDefault();
    setLoadingId(mentorId); // Set loading for this specific mentor
    try {
      const response = await paymentMutation.mutateAsync(datas);

      if (typeof response === "string") {
        window.location.href = response;
      } else {
        console.error("Invalid response:", response);
      }
    } catch (error) {
      toast.error("Payment failed");
      console.error("Payment error:", error);
    } finally {
      setLoadingId(null); // Reset loading state
    }
  };

  const handleConnect = async (action: string) => {
    // const { getALLconnectMutation, responseMutation } = Payment();
    console.log("this is mentore is", action);
    const response = await AskMutation.mutateAsync(action);

    console.log("this is response", response);
    toast.success(`${response}`);
  };

  const filteredProfiles = profiles.filter((profile) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      profile.title?.toLowerCase().includes(searchLower) ||
      profile.university?.toLowerCase().includes(searchLower) ||
      profile.location?.toLowerCase().includes(searchLower) ||
      profile.bio?.toLowerCase().includes(searchLower) ||
      profile.skillsToTeach?.some((skill: string) =>
        skill.toLowerCase().includes(searchLower)
      ) ||
      profile.skillsToLearn?.some((skill: string) =>
        skill.toLowerCase().includes(searchLower)
      );

    const matchesFilters =
      activeFilters.length === 0 ||
      profile.skillsToTeach?.some((skill: string) =>
        activeFilters.includes(skill)
      ) ||
      profile.skillsToLearn?.some((skill: string) =>
        activeFilters.includes(skill)
      );

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="heading-2 mb-4">Browse Mentors</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with expert mentors in various fields.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Available Mentors</h2>
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search mentors..."
                  className="pl-10 h-11"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-6">
              <span className="text-sm font-medium flex items-center gap-1 text-muted-foreground">
                <Filter className="h-4 w-4" /> Filter by skill:
              </span>

              {getAllSkills().map((skill) => (
                <Badge
                  key={skill}
                  variant={
                    activeFilters.includes(skill) ? "default" : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => toggleFilter(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>

            {filteredProfiles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No mentors found matching your criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topRatedMentors.map((profile, index) => (
                    <MentorCard
                      key={profile._id}
                      profile={{
                        id: profile.userid,
                        name: profile.title,
                        title: profile.title,
                        teaches: profile.skillsToTeach || [],
                        learns: profile.skillsToLearn || [],
                        rating: 4.5,
                        reviews: 5,
                        university: profile.university,
                        location: profile.location,
                        bio: profile.bio,
                        isPremium: index < 3, // First 3 are premium
                      }}
                      isLoading={loadingId === profile._id}
                      onConnect={handleConnect}
                      onSubmit={handleSubmit}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfiles.map((profile, index) => (
                    <MentorCard
                      key={profile._id}
                      profile={{
                        id: profile.userid,
                        name: profile.title,
                        title: profile.title,
                        teaches: profile.skillsToTeach || [],
                        learns: profile.skillsToLearn || [],
                        rating: 4.5,
                        reviews: 5,
                        university: profile.university,
                        location: profile.location,
                        bio: profile.bio,
                        // isPremium: index < 3, // First 3 are premium
                      }}
                      isLoading={loadingId === profile._id}
                      onConnect={handleConnect}
                      onSubmit={handleSubmit}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
