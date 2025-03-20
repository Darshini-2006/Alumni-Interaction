import { useState } from 'react';
import { Calendar, Clock, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Workshops data remains as in your original code
const workshopsData = [
  {
    id: 1,
    title: 'Machine Learning Fundamentals',
    presenter: 'Rishik Yadav',
    presenterRole: 'Senior Software Engineer at TCS',
    date: '2025-o4-15',
    time: '14:00 - 16:00',
    description:
      'Learn the basics of machine learning algorithms and their applications in real-world scenarios.',
    agenda: [
      'Introduction to ML concepts',
      'Supervised vs Unsupervised Learning',
      'Hands-on practice with Python',
      'Q&A session'
    ],
    registrationOpen: true,
    approvalStatus: 'approved'
  },
  {
    id: 2,
    title: 'Career Paths in Product Management',
    presenter: 'Darshini Rathinavel',
    presenterRole: 'Product Manager at Flanzer',
    date: '2025-04-22',
    time: '10:00 - 12:00',
    description:
      'Discover how to transition into product management and the skills needed to succeed in this role.',
    agenda: [
      'What is Product Management?',
      'Key skills for Product Managers',
      'Interview preparation tips',
      'Q&A with industry PMs'
    ],
    registrationOpen: true,
    approvalStatus: 'approved'
  }
];

const Events = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [isWorkshopDialogOpen, setIsWorkshopDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterForWorkshop = (workshop: any) => {
    setSelectedWorkshop(workshop);
    setIsWorkshopDialogOpen(true);
  };

  const handleWorkshopRegistrationSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Registration successful!', {
        description: `You have successfully registered for "${selectedWorkshop.title}".`
      });
      setIsWorkshopDialogOpen(false);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
    <div className="container mx-auto mt-16 px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workshopsData.map((workshop) => (
          <Card key={workshop.id} className="glass-card border-none">
            <CardContent className="p-6">
              <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20">
                Webinar
              </Badge>
              <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>

              <div className="flex items-center text-muted-foreground mb-4">
                <span>Presented by </span>
                <span className="font-medium text-foreground ml-1">
                  {workshop.presenter}
                </span>
                <span className="mx-1">•</span>
                <span>{workshop.presenterRole}</span>
              </div>

              <p className="text-muted-foreground mb-4">{workshop.description}</p>

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
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(workshop.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="bg-secondary/50 px-3 py-2 rounded-md text-sm flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{workshop.time}</span>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!workshop.registrationOpen}
                onClick={() => handleRegisterForWorkshop(workshop)}
              >
                {workshop.registrationOpen ? 'Register Now' : 'Registration Closed'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isWorkshopDialogOpen} onOpenChange={setIsWorkshopDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Register for Workshop</DialogTitle>
            <DialogDescription>
              Complete your registration for "{selectedWorkshop?.title}".
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-md">
                <h4 className="font-medium">Workshop Details</h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date:</p>
                    <p>
                      {selectedWorkshop?.date &&
                        new Date(selectedWorkshop.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time:</p>
                    <p>{selectedWorkshop?.time}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Presenter:</p>
                    <p>
                      {selectedWorkshop?.presenter} • {selectedWorkshop?.presenterRole}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                A confirmation email will be sent to your registered email address with further details and any preparation materials.
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsWorkshopDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWorkshopRegistrationSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Confirm Registration'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    <Footer/>
    </div>
  );
};

export default Events;
