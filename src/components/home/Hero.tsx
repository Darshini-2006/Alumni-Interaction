
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
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl opacity-50 pointer-events-none"></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary mb-6 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
            Connect with alumni and shape your future
          </span>
          
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance animate-fade-in animate-delay-100">
            Connect. Mentor.{" "}
            <span className="relative inline-block">
              Inspire.
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/10 -z-10 transform -rotate-1"></span>
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
                  onClick={() => setShowRoleSelector(true)}
                  className="group relative overflow-hidden w-full sm:w-auto"
                >
                  <span className="relative z-10">Register Now</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Log In <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Notification flash message */}
          <div className="mt-12 glass-card py-3 px-4 rounded-lg animate-fade-in animate-delay-400">
            <p className="text-sm font-medium flex items-center">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              <span className="text-primary">New:</span>
              <span className="ml-2">Upcoming webinar on "Tech Careers in 2024" - Register now</span>
              <Button variant="link" size="sm" className="ml-2 p-0 h-auto">
                Learn more
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
