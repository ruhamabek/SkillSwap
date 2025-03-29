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
    skillsToTeach: [] as string[], // Ensure this is an array
    skillsToLearn: [] as string[], // Ensure this is an array
  });
  const [skillToTeach, setSkillToTeach] = useState("");
  const [skillToLearn, setSkillToLearn] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || "",
        university: profile.university || "",
        location: profile.location || "",
        bio: profile.bio || "",
        skillsToTeach: Array.isArray(profile.skillsToTeach) ? profile.skillsToTeach : [],
        skillsToLearn: Array.isArray(profile.skillsToLearn) ? profile.skillsToLearn : [],
      });
    }
  }, [profile]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, bio: e.target.value });
  };

  const addSkill = (type: "teach" | "learn") => {
    const skill = type === "teach" ? skillToTeach.trim() : skillToLearn.trim();
    if (!skill) return;

    const field = type === "teach" ? "skillsToTeach" : "skillsToLearn";
    if (!formData[field].includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...prev[field], skill], // Add skill to the array
      }));
    }

    type === "teach" ? setSkillToTeach("") : setSkillToLearn("");
  };

  const removeSkill = (type: "teach" | "learn", index: number) => {
    const field = type === "teach" ? "skillsToTeach" : "skillsToLearn";
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index), // Remove skill from the array
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile) {
      updateProfileMutation.mutate(formData); // Save the data as arrays
    } else {
      createProfileMutation.mutate(formData); // Save the data as arrays
    }
    toast({
      title: "Profile updated successfully",
      description: "Your profile has been saved.",
    });
    navigate("/profile");
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={32} /></div>;
  if (isError) return <div className="text-red-500 text-center">Error loading profile</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg bg-white p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile Setup</h2>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              name="university"
              placeholder="University"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              required
            />
            <Input
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleBioChange}
              className="w-full p-2 border rounded-md"
              rows={4}
              required
            />

            {/* Skills to Teach */}
            <div>
              <h3 className="font-semibold">Skills to Teach</h3>
              <div className="flex gap-2">
                <Input
                  value={skillToTeach}
                  onChange={(e) => setSkillToTeach(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button type="button" onClick={() => addSkill("teach")}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skillsToTeach.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-md">
                    <span>{skill}</span>
                    <X
                      className="cursor-pointer"
                      onClick={() => removeSkill("teach", index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills to Learn */}
            <div>
              <h3 className="font-semibold">Skills to Learn</h3>
              <div className="flex gap-2">
                <Input
                  value={skillToLearn}
                  onChange={(e) => setSkillToLearn(e.target.value)}
                  placeholder="Add a skill"
                />
                <Button type="button" onClick={() => addSkill("learn")}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skillsToLearn.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-200 px-2 py-1 rounded-md">
                    <span>{skill}</span>
                    <X
                      className="cursor-pointer"
                      onClick={() => removeSkill("learn", index)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              Save Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;