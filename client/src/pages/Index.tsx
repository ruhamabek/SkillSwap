
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MatchSection from '@/components/MatchSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, MessageSquare, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';

const Index = () => {
  const navigate = useNavigate();
  const {data: session} = authClient.useSession(); 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: 'Find Your Match',
      description: 'Our algorithm connects you with peers who have complementary skill sets to maximize learning benefits.'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: 'Learn & Teach',
      description: 'Share your expertise while learning new skills – creating a balanced exchange of knowledge.'
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: 'Connect Directly',
      description: 'Schedule sessions, share resources, and communicate seamlessly through our integrated platform.'
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: 'Grow Together',
      description: 'Build lasting connections with peers who share your passion for continuous learning and improvement.'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Set up your profile highlighting your skills and what you want to learn.'
    },
    {
      step: '02',
      title: 'Find Matches',
      description: 'Browse potential matches or let our algorithm suggest compatible skill exchanges.'
    },
    {
      step: '03',
      title: 'Connect & Plan',
      description: 'Reach out, discuss expectations, and set up a schedule that works for both.'
    },
    {
      step: '04',
      title: 'Exchange & Grow',
      description: 'Share your knowledge, learn new skills, and build your network.'
    }
  ];

  const testimonials = [
    {
      quote: "SkillSwap helped me find a coding mentor who taught me Python while I helped them with graphic design. It's a brilliant concept!",
      author: "Maria J.",
      role: "Computer Science Student",
      university: "MIT"
    },
    {
      quote: "I've learned three new skills in just two months. The peer-to-peer approach makes learning more engaging and practical.",
      author: "David T.",
      role: "Business Student",
      university: "UCLA"
    },
    {
      quote: "Finding someone to practice languages with was always difficult. Now I've improved my Spanish while teaching English.",
      author: "Sophie L.",
      role: "Linguistics Student",
      university: "Columbia University"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      

      <main>
        <Hero />

        {/* Features Section */}
        <section className="py-20 px-6 md:px-8 bg-muted/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">How SkillSwap Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform makes it easy to connect with peers, learn new
                skills, and share your expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 p-3 bg-primary/10 inline-block rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works (Steps) */}
        <section className="py-20 px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">Simple Steps to Get Started</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start your skill exchange journey in four easy steps and unlock
                new learning opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="absolute -top-6 -left-6 text-8xl font-bold text-primary/10 group-hover:text-primary/15 transition-colors">
                    {step.step}
                  </div>
                  <div className="relative bg-white p-6 rounded-xl shadow-sm border border-border z-10 group-hover:shadow-md transition-all">
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                className="gap-2"
                onClick={() => {
                  session ? navigate("/profile") : navigate("/sign-up");
                }}
              >
                <span className="flex items-center gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 md:px-8 bg-accent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="heading-2 mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Read about the experiences of students who have successfully
                exchanged skills on our platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="glassmorphism p-6 rounded-xl relative"
                >
                  <div className="mb-6 text-5xl text-primary/20">"</div>
                  <p className="text-foreground mb-6 relative z-10">
                    {testimonial.quote}
                  </p>
                  <div className="flex flex-col">
                    <span className="font-semibold">{testimonial.author}</span>
                    <span className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {testimonial.university}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Showcase matching */}
        <MatchSection />

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-8 bg-gradient-to-br from-primary/90 to-secondary/90 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Skill Exchange Journey?
            </h2>
            <p className="text-xl mb-8 text-white/80 max-w-2xl mx-auto">
              Join thousands of students who are already expanding their
              skillsets and building meaningful connections.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" className="text-primary">
                Create Your Profile
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white/30 hover:bg-white/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
