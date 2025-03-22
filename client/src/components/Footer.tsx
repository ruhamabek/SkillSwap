
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Instagram, Twitter, Linkedin, Facebook, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-accent py-12 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-medium tracking-tight">SkillSwap</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              A peer-to-peer platform for students to exchange skills and knowledge.
            </p>
            <div className="flex space-x-3 mt-4">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">Platform</h3>
            <ul className="space-y-3">
              {['Browse', 'How It Works', 'Success Stories', 'Universities', 'FAQ'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">Resources</h3>
            <ul className="space-y-3">
              {['Blog', 'Podcasts', 'Events', 'Guides', 'Help Center'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-4">Company</h3>
            <ul className="space-y-3">
              {['About', 'Careers', 'Partners', 'Contact', 'Terms', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link 
                    to={`/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Built with</span>
            <Github className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">and</span>
            <span className="text-xs font-medium">React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
