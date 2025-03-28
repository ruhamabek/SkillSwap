
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Book, Code, Palette, Mic, Users } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const Hero = () => {
  const {data: session} = authClient.useSession();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const shapeRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Animation for floating shapes
  useEffect(() => {
    const animateShapes = () => {
      shapeRefs.current.forEach((shape, index) => {
        if (!shape) return;
        
        const speedFactor = 0.3 + (index * 0.1);
        const yMovement = Math.sin(Date.now() * 0.001 * speedFactor) * 15;
        const xMovement = Math.cos(Date.now() * 0.002 * speedFactor) * 10;
        
        shape.style.transform = `translate(${xMovement}px, ${yMovement}px)`;
      });
      
      requestAnimationFrame(animateShapes);
    };
    
    const animationId = requestAnimationFrame(animateShapes);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const skillIcons = [
    { icon: Code, color: 'bg-skill-python', label: 'Coding' },
    { icon: Palette, color: 'bg-skill-design', label: 'Design' },
    { icon: Book, color: 'bg-skill-writing', label: 'Writing' },
    { icon: Mic, color: 'bg-skill-music', label: 'Music' },
    { icon: Users, color: 'bg-skill-marketing', label: 'Marketing' },
  ];

  return (
    <div 
      ref={heroRef}
      className="relative min-h-[90vh] pt-28 overflow-hidden flex flex-col items-center justify-center px-6 md:px-12"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          ref={el => shapeRefs.current[0] = el}
          className="absolute top-1/4 right-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl transition-transform duration-1000 ease-in-out"
        />
        <div 
          ref={el => shapeRefs.current[1] = el}
          className="absolute top-1/3 -left-[5%] w-72 h-72 bg-secondary/5 rounded-full blur-3xl transition-transform duration-1000 ease-in-out"
        />
        <div 
          ref={el => shapeRefs.current[2] = el}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl transition-transform duration-1000 ease-in-out"
        />
      </div>

      {/* Hero Content */}
      <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-up">
        <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full text-primary font-medium text-sm mb-4">
          Exchange Knowledge. Grow Together.
        </div>
        
        <h1 className="heading-1 text-balance">
          The Peer-to-Peer <span className="text-primary">Skill Exchange</span> Platform for Students
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
          Share your expertise and learn new skills from peers. 
          Create meaningful connections through knowledge exchange.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="gap-2 text-base" asChild>
            <Link to="/browse">
              Browse Skills <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
           <Button
            size="lg"
            className="gap-2"
            onClick={() => {
              session ? navigate("/profile") : navigate("/sign-up");
            }}
          >
            <span className="flex items-center gap-2">
              Create Profile <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </div>

        {/* Skills display */}
        <div className="pt-12 flex flex-wrap gap-3 justify-center animate-fade-in [animation-delay:400ms]">
          {skillIcons.map((skill, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm 
                        rounded-full border border-border shadow-sm transition-all 
                        hover:shadow-md hover:-translate-y-1"
            >
              <div className={`p-1.5 rounded-full ${skill.color}`}>
                <skill.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium">{skill.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="w-full max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in [animation-delay:600ms]">
        {[
          { value: '5000+', label: 'Active Users' },
          { value: '2500+', label: 'Skills Shared' },
          { value: '10000+', label: 'Successful Matches' },
        ].map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-muted/50" />
    </div>
  );
};

export default Hero;
