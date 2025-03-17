
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WorkshopCardProps {
  workshop: {
    id: number;
    title: string;
    presenter: string;
    presenterRole: string;
    date: string;
    time: string;
    description: string;
    agenda: string[];
    registrationOpen: boolean;
    approvalStatus: string;
  };
  onRegister: (workshop: any) => void;
}

const WorkshopCard = ({ workshop, onRegister }: WorkshopCardProps) => {
  return (
    <Card className="glass-card border-none">
      <CardContent className="p-6">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
          Webinar
        </Badge>
        <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
        
        <div className="flex items-center text-muted-foreground mb-4">
          <span>Presented by </span>
          <span className="font-medium text-foreground ml-1">{workshop.presenter}</span>
          <span className="mx-1">•</span>
          <span>{workshop.presenterRole}</span>
        </div>
        
        <p className="text-muted-foreground mb-4">
          {workshop.description}
        </p>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Agenda</h4>
          <ul className="list-disc pl-5 text-muted-foreground space-y-1">
            {workshop.agenda.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-secondary/50 px-3 py-2 rounded-md text-sm flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-primary" />
            <span>{new Date(workshop.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="bg-secondary/50 px-3 py-2 rounded-md text-sm flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            <span>{workshop.time}</span>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          disabled={!workshop.registrationOpen}
          onClick={() => onRegister(workshop)}
        >
          {workshop.registrationOpen ? 'Register Now' : 'Registration Closed'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkshopCard;
