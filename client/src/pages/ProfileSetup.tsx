import { useState, useEffect } from "react";
import useProfile from "../api/ProfileApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";


const ProfileSetup = () => {

  const { profile, isLoading, isError, createProfileMutation, updateProfileMutation } = useProfile();
  const [formData, setFormData] = useState({
    title: "",
    university: "",
    location: "",
    bio: "",
    skillsToTeach: "",
    skillsToLearn: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        title: profile.title || "",
        university: profile.university || "",
        location: profile.location || "",
        bio: profile.bio || "",
        skillsToTeach: profile.skillsToTeach || "",
        skillsToLearn: profile.skillsToLearn || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (profile) {
      updateProfileMutation.mutate(formData);
    } else {
      createProfileMutation.mutate(formData);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin" size={32} /></div>;
  if (isError) return <div className="text-red-500 text-center">Error loading profile</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg bg-white p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-center mb-4">Profile Setup</h2>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
            <Input name="university" placeholder="University" value={formData.university} onChange={handleChange} required />
            <Input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
            <Input name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} required />
            <Input name="skillsToTeach" placeholder="Skills you want to teach" value={formData.skillsToTeach} onChange={handleChange} required />
            <Input name="skillsToLearn" placeholder="Skills you want to learn" value={formData.skillsToLearn} onChange={handleChange} required />
            <Button type="submit" className="w-full mt-2">{profile ? "Update Profile" : "Create Profile"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSetup;