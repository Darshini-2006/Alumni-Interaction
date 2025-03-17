import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  GraduationCap,
  MessageCircle,
  UserCheck,
  UserPlus,
  Check,
  Users,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/App';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
// Import Firestore functions
import { getFirestore, collection, getDocs } from 'firebase/firestore';

// List of domains (can be adjusted as needed)
const domains = [
  'Software & IT',
  'Mechanical Engineering',
  'Electrical & Electronics Engineering',
  'Civil & Construction Engineering',
  'Chemical & Process Engineering',
  'Computer Science & Engineering',
  'Biomedical Engineering',
  'Aerospace Engineering',
  'Industrial & Production Engineering',
  'Environmental & Energy Engineering',
  'Instrumentation & Control',
  'Entrepreneurship & Innovation',
];

// Workshops data remains as in your original code
const workshopsData = [
  {
    id: 1,
    title: 'Machine Learning Fundamentals',
    presenter: 'Emily Johnson',
    presenterRole: 'Senior Software Engineer at Google',
    date: '2023-10-15',
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
    approvalStatus: 'approved',
  },
  {
    id: 2,
    title: 'Career Paths in Product Management',
    presenter: 'Michael Chen',
    presenterRole: 'Product Manager at Amazon',
    date: '2023-10-22',
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
    approvalStatus: 'approved',
  },
];

const Alumni = () => {
  const { isLoggedIn, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState<any>(null);
  const [isConnectDialogOpen, setIsConnectDialogOpen] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedTab, setSelectedTab] = useState<'alumni' | 'workshops'>('alumni');
  const [localAlumniData, setLocalAlumniData] = useState<any[]>([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState<any>(null);
  const [isWorkshopDialogOpen, setIsWorkshopDialogOpen] = useState(false);

  // Fetch alumni data from Firestore on component mount
  useEffect(() => {
    const fetchAlumniData = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'alumni'));
        const alumniList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: `${data.firstName} ${data.lastName}`,
            photo: data.profilePhoto || 'https://via.placeholder.com/150',
            batch: data.graduationYear,
            company: data.company || 'N/A',
            role: data.jobTitle || 'N/A',
            // If location is not saved in registration, show a default value.
            location: data.location || 'N/A',
            // Map forums from the alumni form to domains; adjust as needed.
            domains: data.forums || [],
            // Default values for availability and connection status
            available: true,
            connectionStatus: 'none'
          };
        });
        setLocalAlumniData(alumniList);
      } catch (error) {
        console.error('Error fetching alumni data:', error);
        toast.error('Failed to load alumni data.');
      }
    };
    fetchAlumniData();
  }, []);

  const filteredAlumni = localAlumniData.filter((alumni) => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alumni.company && alumni.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alumni.role && alumni.role.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDomains =
      selectedDomains.length === 0 ||
      alumni.domains.some((domain: string) => selectedDomains.includes(domain));

    return matchesSearch && matchesDomains;
  });

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleConnectClick = (alumni: any) => {
    if (!isLoggedIn) {
      toast.error('You need to log in to connect with alumni', {
        description: 'Please log in or register to send connection requests.'
      });
      return;
    }

    setSelectedAlumni(alumni);
    setIsConnectDialogOpen(true);
  };

  const handleConnectionSubmit = () => {
    if (!connectionMessage.trim()) {
      toast.error('Please add a message to introduce yourself');
      return;
    }

    setIsSubmitting(true);

    const inappropriateWords = ['inappropriate', 'offensive', 'rude'];
    const hasInappropriateContent = inappropriateWords.some((word) =>
      connectionMessage.toLowerCase().includes(word)
    );

    if (hasInappropriateContent) {
      toast.error('Your message contains inappropriate content', {
        description: 'Please revise your message and try again.'
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setLocalAlumniData((prev) =>
        prev.map((alumni) =>
          alumni.id === selectedAlumni.id
            ? { ...alumni, connectionStatus: 'pending' }
            : alumni
        )
      );

      toast.success('Connection request sent!', {
        description: `Your request to connect with ${selectedAlumni.name} has been sent.`
      });

      setConnectionMessage('');
      setIsConnectDialogOpen(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleStartChat = (alumni: any) => {
    setSelectedAlumni(alumni);
    setChatMessages([
      {
        sender: 'system',
        content: `You are now connected with ${alumni.name}.`,
        timestamp: new Date().toISOString()
      }
    ]);
    setIsChatDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const inappropriateWords = ['inappropriate', 'offensive', 'rude'];
    const hasInappropriateContent = inappropriateWords.some((word) =>
      messageInput.toLowerCase().includes(word)
    );

    if (hasInappropriateContent) {
      toast.error('Your message contains inappropriate content', {
        description: 'Please revise your message and try again.'
      });
      return;
    }

    const newMessage = {
      sender: 'user',
      content: messageInput,
      timestamp: new Date().toISOString()
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setMessageInput('');

    setTimeout(() => {
      const responseMessage = {
        sender: 'alumni',
        content: `Thanks for reaching out! This is a simulated response from ${selectedAlumni.name}.`,
        timestamp: new Date().toISOString()
      };
      setChatMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  const handleRegisterForWorkshop = (workshop: any) => {
    if (!isLoggedIn) {
      toast.error('You need to log in to register for workshops', {
        description: 'Please log in or register to continue.'
      });
      return;
    }

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
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Alumni Network
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connect with successful alumni, join upcoming workshops and webinars, and build your professional network.
            </p>

            <div className="mt-8 inline-flex items-center rounded-md border border-border p-1">
              <button
                onClick={() => setSelectedTab('alumni')}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                  selectedTab === 'alumni'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                <Users className="h-4 w-4 inline mr-2" />
                Alumni Directory
              </button>
              <button
                onClick={() => setSelectedTab('workshops')}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                  selectedTab === 'workshops'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-secondary'
                }`}
              >
                <GraduationCap className="h-4 w-4 inline mr-2" />
                Workshops & Webinars
              </button>
            </div>
          </div>

          {selectedTab === 'alumni' ? (
            <>
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-10"
                      placeholder="Search by name, company, or role"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {selectedDomains.length > 0 && (
                      <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {selectedDomains.length}
                      </span>
                    )}
                  </Button>
                </div>

                {showFilters && (
                  <div className="glass-card p-4 rounded-lg mb-6 animate-fade-in">
                    <h3 className="font-medium mb-3">Domains</h3>
                    <div className="flex flex-wrap gap-2">
                      {domains.map((domain) => (
                        <button
                          key={domain}
                          className={`text-xs rounded-full px-3 py-1 transition-colors ${
                            selectedDomains.includes(domain)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                          onClick={() => toggleDomain(domain)}
                        >
                          {domain}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.length > 0 ? (
                  filteredAlumni.map((alumni) => (
                    <Card
                      key={alumni.id}
                      className="overflow-hidden glass-card border-none hover:shadow-md transition-shadow duration-300"
                    >
                      <CardContent className="p-0">
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            <img
                              src={alumni.photo}
                              alt={alumni.name}
                              className="h-16 w-16 rounded-full object-cover border-2 border-border"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg truncate">{alumni.name}</h3>
                              <p className="text-muted-foreground text-sm flex items-center">
                                <Briefcase className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                {alumni.role} at {alumni.company}
                              </p>
                              <p className="text-muted-foreground text-sm flex items-center mt-1">
                                <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                                {alumni.location}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center text-xs text-muted-foreground">
                            <GraduationCap className="h-3.5 w-3.5 mr-1" />
                            <span>Class of {alumni.batch}</span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {alumni.domains.map((domain: string) => (
                              <span
                                key={domain}
                                className="bg-primary/10 text-primary text-xs rounded-full px-2.5 py-0.5"
                              >
                                {domain}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-2 border-t border-border p-4 flex justify-between items-center">
                          <span
                            className={`flex items-center text-xs ${
                              alumni.available ? 'text-green-600' : 'text-muted-foreground'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                alumni.available ? 'bg-green-600' : 'bg-muted-foreground'
                              }`}
                            ></span>
                            {alumni.available ? 'Available for mentoring' : 'Not available now'}
                          </span>

                          {alumni.connectionStatus === 'none' && (
                            <Button
                              variant="default"
                              className="gap-1.5"
                              onClick={() => handleConnectClick(alumni)}
                            >
                              <UserPlus className="h-4 w-4" />
                              Connect
                            </Button>
                          )}

                          {alumni.connectionStatus === 'pending' && (
                            <Button variant="outline" disabled className="gap-1.5">
                              <Check className="h-4 w-4" />
                              Request Sent
                            </Button>
                          )}

                          {alumni.connectionStatus === 'connected' && (
                            <Button
                              variant="default"
                              className="gap-1.5"
                              onClick={() => handleStartChat(alumni)}
                            >
                              <MessageCircle className="h-4 w-4" />
                              Message
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    No alumni found matching your search.
                  </div>
                )}
              </div>
            </>
          ) : (
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
                      <span className="font-medium text-foreground ml-1">{workshop.presenter}</span>
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
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
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
                        <Clock className="h-4 w-4 mr-2 text-primary" />
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
          )}
        </section>
      </main>
      <Footer />

      <Dialog open={isConnectDialogOpen} onOpenChange={setIsConnectDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Connect with {selectedAlumni?.name}</DialogTitle>
            <DialogDescription>
              Send a connection request with a brief message introducing yourself.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="connection-message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <Textarea
                  id="connection-message"
                  className="min-h-[150px]"
                  placeholder="Briefly introduce yourself and explain why you'd like to connect..."
                  value={connectionMessage}
                  onChange={(e) => setConnectionMessage(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Your profile information will be shared with this alumni when you send a connection request.
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setIsConnectDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConnectionSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="sm:max-w-[550px] h-[70vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center">
              {selectedAlumni && (
                <>
                  <img
                    src={selectedAlumni.photo}
                    alt={selectedAlumni.name}
                    className="h-8 w-8 rounded-full mr-3"
                  />
                  {selectedAlumni.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : msg.sender === 'system'
                      ? 'bg-secondary text-center w-full text-sm'
                      : 'bg-secondary'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t flex gap-2">
            <Textarea
              className="min-h-[44px] resize-none"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button className="h-[44px]" onClick={handleSendMessage}>
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                    <p>{selectedWorkshop?.date && new Date(selectedWorkshop.date).toLocaleDateString()}</p>
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
  );
};

export default Alumni;
