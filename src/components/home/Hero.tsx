import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RoleSelector from '@/components/shared/RoleSelector';

const Hero = () => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);

  return (
    <section className="relative overflow-hidden pt-32 md:pt-40 pb-20">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-60 bg-gradient-to-b from-primary/10 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl animate-hero-glow pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-2xl animate-hero-glow pointer-events-none"></div>
      <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-xl animate-hero-glow pointer-events-none"></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary mb-6 animate-fade-in backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse-soft"></span>
            Connect with alumni and shape your future
          </span>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance animate-fade-in animate-delay-100">
            Connect. Mentor.{" "}
            <span className="relative inline-block">
              <span className="gradient-text">Inspire.</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-accent/20 -z-10 transform -rotate-1"></span>
            </span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto text-balance animate-fade-in animate-delay-200">
            Join our platform connecting students with alumni mentors. Build professional connections, find career opportunities, and gain valuable insights from industry experts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-in animate-delay-300">
            {showRoleSelector ? (
              <RoleSelector onClose={() => setShowRoleSelector(false)} />
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 transition-all duration-300 group relative overflow-hidden rounded-full shadow-lg shadow-primary/20"
                  onClick={() => setShowRoleSelector(true)}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative font-medium">Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full hover:bg-accent/5 border-primary/20 hover:border-primary/40 transition-all duration-300"
                >
                  <span className="font-medium">Learn More</span>
                </Button>
              </>
            )}
          </div>

          {/* Notification flash message */}
          <div className="mt-12 glass-card py-3 px-4 rounded-full animate-fade-in animate-delay-400 border border-primary/10 shadow-sm shadow-primary/5">
            <p className="text-sm font-medium flex items-center">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse-soft mr-2"></span>
              <span className="text-accent font-semibold">New:</span>
              <span className="ml-2">Upcoming webinar on "Tech Careers in 2024"</span>
              <Button variant="link" size="sm" className="ml-2 p-0 h-auto text-primary font-medium">
                Register now
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
