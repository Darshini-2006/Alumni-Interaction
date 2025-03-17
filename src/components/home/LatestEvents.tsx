
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// Sample event data
const events = [
  {
    id: 1,
    title: 'Tech Careers in 2024',
    date: 'May 18, 2023',
    time: '10:00 AM - 12:00 PM',
    host: 'Sarah Johnson',
    hostRole: 'Senior Software Engineer at Google',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  },
  {
    id: 2,
    title: 'Breaking into Finance Industry',
    date: 'May 22, 2023',
    time: '2:00 PM - 4:00 PM',
    host: 'Michael Chang',
    hostRole: 'Investment Banker at JP Morgan',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
  },
  {
    id: 3,
    title: 'Entrepreneurship Workshop',
    date: 'May 25, 2023',
    time: '3:00 PM - 5:00 PM',
    host: 'Jessica Lee',
    hostRole: 'Founder & CEO of StartupX',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
  },
];

const LatestEvents = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-primary/10 text-primary mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
              Upcoming Events
            </span>
            
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
              Join our next webinars
            </h2>
            
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Learn from industry experts and gain valuable insights through our interactive webinars and workshops.
            </p>
          </div>
          
          <Link to="/events" className="mt-6 md:mt-0">
            <Button variant="outline" className="gap-2">
              View all events
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden border-none glass-card hover:shadow-md transition-shadow duration-300">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Hosted by <span className="font-medium">{event.host}</span>, {event.hostRole}
                </p>
                <Button className="w-full">Register Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestEvents;
