
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const formSchema = z.object({
  displayName: z.string().min(2, { message: "Display name must be at least 2 characters" }),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  bio: z.string().min(10, { message: "Bio must be at least 10 characters" }).max(300, { message: "Bio must be less than 300 characters" }),
  university: z.string().optional(),
  location: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teachSkills, setTeachSkills] = useState<string[]>([]);
  const [learnSkills, setLearnSkills] = useState<string[]>([]);
  const [newTeachSkill, setNewTeachSkill] = useState('');
  const [newLearnSkill, setNewLearnSkill] = useState('');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: "",
      title: "",
      bio: "",
      university: "",
      location: "",
      avatarUrl: "",
    },
  });

  const addTeachSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeachSkill.trim() && !teachSkills.includes(newTeachSkill.trim())) {
      setTeachSkills([...teachSkills, newTeachSkill.trim()]);
      setNewTeachSkill('');
    }
  };

  const removeTeachSkill = (skill: string) => {
    setTeachSkills(teachSkills.filter(s => s !== skill));
  };

  const addLearnSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLearnSkill.trim() && !learnSkills.includes(newLearnSkill.trim())) {
      setLearnSkills([...learnSkills, newLearnSkill.trim()]);
      setNewLearnSkill('');
    }
  };

  const removeLearnSkill = (skill: string) => {
    setLearnSkills(learnSkills.filter(s => s !== skill));
  };

  const onSubmit = async (data: FormValues) => {
    // In a real app, this would send data to your backend
    console.log("Profile data:", { ...data, teachSkills, learnSkills });
    
    // Simulate saving profile
    setTimeout(() => {
      toast({
        title: "Profile created!",
        description: "Your profile has been set up successfully.",
      });
      navigate('/profile');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-background rounded-xl shadow-sm p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Set Up Your Profile</h1>
            <p className="text-muted-foreground">
              Help others learn about you and your skills
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={form.watch('avatarUrl')} />
                    <AvatarFallback className="text-2xl">
                      {form.watch('displayName')?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <FormField
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input 
                            placeholder="Avatar URL (optional)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title*</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Computer Science Student" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="university"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University/School</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. MIT (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Boston, MA (optional)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell others about yourself, your interests, and your expertise..."
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Skills You Can Teach*</h3>
                    <p className="text-sm text-muted-foreground">
                      What skills are you proficient in and willing to teach others?
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {teachSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeTeachSkill(skill)}
                          className="ml-1 rounded-full hover:bg-muted p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <form onSubmit={addTeachSkill} className="flex gap-2">
                    <Input
                      value={newTeachSkill}
                      onChange={(e) => setNewTeachSkill(e.target.value)}
                      placeholder="e.g. JavaScript, Photography, Statistics"
                      className="flex-1"
                    />
                    <Button type="submit" variant="outline">Add</Button>
                  </form>
                  {teachSkills.length === 0 && (
                    <p className="text-destructive text-sm">Please add at least one skill you can teach</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Skills You Want to Learn*</h3>
                    <p className="text-sm text-muted-foreground">
                      What skills are you interested in learning from others?
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {learnSkills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="pr-1">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeLearnSkill(skill)}
                          className="ml-1 rounded-full hover:bg-muted p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <form onSubmit={addLearnSkill} className="flex gap-2">
                    <Input
                      value={newLearnSkill}
                      onChange={(e) => setNewLearnSkill(e.target.value)}
                      placeholder="e.g. Python, Public Speaking, Calculus"
                      className="flex-1"
                    />
                    <Button type="submit" variant="outline">Add</Button>
                  </form>
                  {learnSkills.length === 0 && (
                    <p className="text-destructive text-sm">Please add at least one skill you want to learn</p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-border">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/sign-in')}
                >
                  Skip for Now
                </Button>
                <Button 
                  type="submit"
                  disabled={teachSkills.length === 0 || learnSkills.length === 0}
                >
                  Complete Profile
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
