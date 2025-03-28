import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useProfile from "../api/ProfileApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { profile, isLoading, isError, createProfileMutation, updateProfileMutation } = useProfile();
  const [formData, setFormData] = useState({
    title: "",
    university: "",
    location: "",
    bio: "",
    skillsToTeach: [] as string[],
    skillsToLearn: [] as string[],
  });
  const [skillToTeach, setSkillToTeach] = useState("");
  const [skillToLearn, setSkillToLearn] = useState("");

  useEffect(() => {
    if (profile) {
      // Handle both string and array formats for skills
      const parseSkills = (skills: any): string[] => {
        if (!skills) return [];
        if (Array.isArray(skills)) return skills;
        if (typeof skills === 'string') return skills.split(',');
        return [];
      };

      setFormData({
        title: profile.title || "",
        university: profile.university || "",
        location: profile.location || "",
        bio: profile.bio || "",
        skillsToTeach: parseSkills(profile.skillsToTeach),
        skillsToLearn: parseSkills(profile.skillsToLearn),
      });
    }
  }, [profile]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, bio: e.target.value });
  };

  const addSkill = (type: 'teach' | 'learn') => {
    const skill = type === 'teach' ? skillToTeach.trim() : skillToLearn.trim();
    if (!skill) return;

    const field = type === 'teach' ? 'skillsToTeach' : 'skillsToLearn';
    if (!formData[field].includes(skill)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], skill]
      }));
    }

    type === 'teach' ? setSkillToTeach("") : setSkillToLearn("");
  };

  const removeSkill = (type: 'teach' | 'learn', index: number) => {
    const field = type === 'teach' ? 'skillsToTeach' : 'skillsToLearn';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateBio = (bio: string): boolean => {
    const words = bio.trim().split(/\s+/);
    return words.filter(word => word.length > 0).length >= 20;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateBio(formData.bio)) {
      toast({
        variant: "destructive",
        title: "Bio Requirement",
        description: "Bio must contain at least 20 words"
      });
      return;
    }

    const payload = {
      ...formData,
      skillsToTeach: formData.skillsToTeach.join(','),
      skillsToLearn: formData.skillsToLearn.join(',')
    };

    const mutation = profile ? updateProfileMutation : createProfileMutation;
    mutation.mutate(payload, { onSuccess: () => navigate("/profile") });
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={32} /></div>;
  if (isError) return <div className="text-red-500 text-center">Error loading profile</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg bg-white p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile Setup</h2>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Title" value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
            
            <Input name="university" placeholder="University" value={formData.university} 
              onChange={(e) => setFormData({ ...formData, university: e.target.value })} required />
            
            <Input name="location" placeholder="Location" value={formData.location} 
              onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
            
            <div className="relative">
              <textarea
                name="bio"
                placeholder="Bio (minimum 20 words)"
                value={formData.bio}
                onChange={handleBioChange}
                className="w-full p-2 border rounded-md min-h-[120px]"
                required
              />
              <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                Word count: {formData.bio.trim().split(/\s+/).filter(word => word.length > 0).length}
              </div>
            </div>

            {/* Skills to Teach Section */}
            <div>
              <div className="flex gap-2">
                <Input
                  value={skillToTeach}
                  onChange={(e) => setSkillToTeach(e.target.value)}
                  placeholder="Skill to teach"
                />
                <Button type="button" onClick={() => addSkill('teach')}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skillsToTeach.map((skill, index) => (
                  <div key={index} className="bg-blue-100 px-3 py-1 rounded-full flex items-center">
                    {skill}
                    <X
                      className="ml-2 cursor-pointer hover:text-blue-600"
                      size={16}
                      onClick={() => removeSkill('teach', index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Learn Section */}
            <div>
              <div className="flex gap-2">
                <Input
                  value={skillToLearn}
                  onChange={(e) => setSkillToLearn(e.target.value)}
                  placeholder="Skill to learn"
                />
                <Button type="button" onClick={() => addSkill('learn')}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skillsToLearn.map((skill, index) => (
                  <div key={index} className="bg-green-100 px-3 py-1 rounded-full flex items-center">
                    {skill}
                    <X
                      className="ml-2 cursor-pointer hover:text-green-600"
                      size={16}
                      onClick={() => removeSkill('learn', index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full mt-2">
              {profile ? "Update Profile" : "Create Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;