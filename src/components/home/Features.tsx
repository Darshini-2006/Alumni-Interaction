import { 
  Users, MessageSquare, Briefcase, 
  Calendar, Search, Shield 
} from 'lucide-react';
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: Users,
    title: 'Alumni Network',
    description: 'Connect with professionals who graduated from your institution and build meaningful relationships.',
  },
  {
    icon: MessageSquare,
    title: 'Forums & Discussions',
    description: 'Engage in domain-specific discussions with peers and industry experts in your field of interest.',
  },
  {
    icon: Briefcase,
    title: 'Job Opportunities',
    description: 'Access exclusive job and internship postings shared directly by alumni working in top companies.',
  },
  {
    icon: Calendar,
    title: 'Webinars & Events',
    description: 'Attend virtual and in-person events featuring insightful talks from industry leaders.',
  },
  {
    icon: Search,
    title: 'Mentorship',
    description: 'Find mentors who can provide guidance and support in your academic and professional journey.',
  },
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'Rest assured knowing all user profiles are verified to maintain a trusted community.',
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const cards = document.querySelectorAll('.feature-card');
    cards.forEach(card => observer.observe(card));
    
    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);
  
  return (
    <section ref={sectionRef} className="py-24 md:py-32 relative">
      {/* Background styling */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/70 to-background"></div>
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-16 section-fade-in">
          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary mb-6 backdrop-blur-sm animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
            Our Platform
          </span>
          
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight animate-fade-in animate-delay-100">
            Everything you need to <span className="gradient-text">succeed</span>
          </h2>
          
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in animate-delay-200">
            Our platform offers a comprehensive set of features designed to connect students with alumni and create opportunities for growth and learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div 
                key={index}
                className="feature-card opacity-0 neo-card p-6 rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 border border-primary/5"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary mr-4 shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
