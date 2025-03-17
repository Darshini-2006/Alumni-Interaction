import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, MapPin, Clock, Calendar, 
  ExternalLink, Filter, Check, ChevronDown, PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/App';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Sample job data
const jobsData = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    postedDate: '2 days ago',
    postedBy: 'Emily Johnson (Alumni, 2016)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/120px-Google_%22G%22_Logo.svg.png',
    description: 'Google is looking for Software Engineers to develop the next-generation of Google products. You\'ll work on a team of engineers to build new features and improve existing ones.',
    requirements: [
      'BS degree in Computer Science or related technical field or equivalent practical experience',
      'Experience with one or more general purpose programming languages including: Java, C/C++, C#, Objective C, Python, JavaScript, or Go',
      'Experience with data structures, algorithms, and software design',
    ],
    domains: ['Software & IT', 'Computer Science & Engineering'],
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    postedDate: '3 days ago',
    postedBy: 'Michael Chen (Alumni, 2015)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/120px-Microsoft_logo.svg.png',
    description: 'Microsoft is seeking a Product Manager to join our Cloud & AI team. You will be responsible for driving product strategy, roadmap, and execution for our cloud services.',
    requirements: [
      'BA/BS degree or equivalent experience',
      '3+ years of product management experience',
      'Experience with cloud technologies, AI/ML, or developer tools',
    ],
    domains: ['Software & IT', 'Computer Science & Engineering'],
  },
  {
    id: 3,
    title: 'Mechanical Engineer Intern',
    company: 'Tesla',
    location: 'Austin, TX',
    type: 'Internship',
    salary: '$30 - $40/hour',
    postedDate: '1 week ago',
    postedBy: 'Sarah Wilson (Alumni, 2019)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/120px-Tesla_Motors.svg.png',
    description: 'Join Tesla\'s Engineering team for a summer internship where you\'ll work on cutting-edge mechanical engineering projects for electric vehicles.',
    requirements: [
      'Currently pursuing a BS or MS in Mechanical Engineering',
      'Experience with CAD software (e.g., SolidWorks, CATIA)',
      'Strong analytical and problem-solving skills',
    ],
    domains: ['Mechanical Engineering', 'Environmental & Energy Engineering'],
  },
  {
    id: 4,
    title: 'Investment Banking Analyst',
    company: 'Goldman Sachs',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$95,000 - $125,000',
    postedDate: '5 days ago',
    postedBy: 'Alexander Lee (Alumni, 2014)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Goldman_Sachs.svg/120px-Goldman_Sachs.svg.png',
    description: 'Goldman Sachs is looking for Investment Banking Analysts to join our team. You\'ll work on financial analysis, valuation, and M&A transactions.',
    requirements: [
      'BA/BS degree with strong academic performance',
      'Demonstrated interest in finance and investment banking',
      'Strong analytical and quantitative skills',
    ],
    domains: ['Entrepreneurship & Innovation'],
  },
  {
    id: 5,
    title: 'Marketing Specialist',
    company: 'Apple',
    location: 'Cupertino, CA',
    type: 'Full-time',
    salary: '$80,000 - $100,000',
    postedDate: '1 week ago',
    postedBy: 'Jessica Rahman (Alumni, 2015)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/120px-Apple_logo_black.svg.png',
    description: 'Apple is seeking a Marketing Specialist to join our Product Marketing team. You\'ll work on developing and executing marketing strategies for our products.',
    requirements: [
      'BA/BS degree in Marketing, Business, or related field',
      '2+ years of experience in marketing or communications',
      'Strong creative thinking and writing skills',
    ],
    domains: ['Entrepreneurship & Innovation'],
  },
  {
    id: 6,
    title: 'UX/UI Designer',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    postedDate: '3 days ago',
    postedBy: 'David Patel (Alumni, 2016)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/120px-Amazon_logo.svg.png',
    description: 'Amazon is looking for a UX/UI Designer to create exceptional user experiences for our websites and apps. You\'ll collaborate with product managers and engineers to design intuitive and engaging user interfaces.',
    requirements: [
      'BA/BS degree in Design, HCI, or related field',
      '3+ years of experience in UX/UI design',
      'Proficiency with design tools (e.g., Figma, Sketch, Adobe XD)',
    ],
    domains: ['Software & IT', 'Computer Science & Engineering'],
  },
];

// Filter options
const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract'];
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

const Jobs = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<typeof jobsData[0] | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [applicationText, setApplicationText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter jobs based on search query and selected filters
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJobType = 
      selectedJobTypes.length === 0 || 
      selectedJobTypes.includes(job.type);
    
    const matchesDomains = 
      selectedDomains.length === 0 || 
      job.domains.some(domain => selectedDomains.includes(domain));
    
    return matchesSearch && matchesJobType && matchesDomains;
  });

  const toggleJobType = (jobType: string) => {
    if (selectedJobTypes.includes(jobType)) {
      setSelectedJobTypes(selectedJobTypes.filter(type => type !== jobType));
    } else {
      setSelectedJobTypes([...selectedJobTypes, jobType]);
    }
  };

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter(d => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleApplyClick = () => {
    if (!isLoggedIn) {
      toast.error("You need to log in to apply for jobs", {
        description: "Please log in or register to apply for this position."
      });
      return;
    }
    
    setIsApplicationDialogOpen(true);
  };

  const handleApplicationSubmit = () => {
    if (!applicationText.trim()) {
      toast.error("Application letter cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log('Job application submitted:', {
        jobId: selectedJob?.id,
        jobTitle: selectedJob?.title,
        company: selectedJob?.company,
        applicationText
      });
      
      toast.success("Application submitted!", {
        description: `Your application for ${selectedJob?.title} at ${selectedJob?.company} has been sent.`
      });
      
      setApplicationText('');
      setIsApplicationDialogOpen(false);
      setIsSubmitting(false);
    }, 1500);
  };

  const handlePostJobClick = () => {
    if (!isLoggedIn) {
      toast.error("You need to log in to post jobs", {
        description: "Please log in or register to post a job."
      });
      return;
    }
    
    navigate('/post-job');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Jobs & Internships
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Explore career opportunities posted by alumni and industry partners. Find the perfect job or internship to kickstart your career.
              </p>
            </div>
            <Button onClick={handlePostJobClick} className="mt-4 md:mt-0 flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Post a Job
            </Button>
          </div>

          {/* Search and filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search jobs by title, company, or location"
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
                {(selectedJobTypes.length > 0 || selectedDomains.length > 0) && (
                  <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {selectedJobTypes.length + selectedDomains.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Filter options */}
            {showFilters && (
              <div className="glass-card p-4 rounded-lg mb-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Job Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobTypes.map((jobType) => (
                        <button
                          key={jobType}
                          className={`text-xs rounded-full px-3 py-1 transition-colors ${
                            selectedJobTypes.includes(jobType)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                          }`}
                          onClick={() => toggleJobType(jobType)}
                        >
                          {jobType}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3">Domains</h3>
                    <div className="flex flex-wrap gap-2">
                      {domains.slice(0, 6).map((domain) => (
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                            More <ChevronDown className="h-3 w-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>More Domains</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuGroup>
                            {domains.slice(6).map((domain) => (
                              <DropdownMenuItem 
                                key={domain}
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleDomain(domain)}
                              >
                                {domain}
                                {selectedDomains.includes(domain) && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Job listings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <button 
                      key={job.id}
                      className={`w-full text-left glass-card border-none rounded-lg p-5 transition-all ${
                        selectedJob?.id === job.id 
                          ? 'ring-2 ring-primary/50 bg-primary/5'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="flex items-center gap-4">
                        <img 
                          src={job.logo} 
                          alt={job.company} 
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <h3 className="font-medium text-base">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <MapPin className="h-3.5 w-3.5 mr-1.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center">
                          <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                          {job.type}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1.5" />
                          {job.postedDate}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No jobs found matching your search.
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {selectedJob ? (
                <Card className="glass-card border-none">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={selectedJob.logo} 
                          alt={selectedJob.company} 
                          className="w-16 h-16 object-contain"
                        />
                        <div>
                          <h2 className="text-xl font-semibold">{selectedJob.title}</h2>
                          <p className="text-lg text-muted-foreground">{selectedJob.company}</p>
                        </div>
                      </div>
                      <Button className="gap-2" onClick={handleApplyClick}>
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-primary" />
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-2 text-primary" />
                        <span>{selectedJob.type}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>Posted {selectedJob.postedDate}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span>{selectedJob.salary}</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Job Description</h3>
                      <p className="text-muted-foreground">{selectedJob.description}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc pl-6 text-muted-foreground">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="mb-1">{req}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Domains</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.domains.map((domain) => (
                          <Badge
                            key={domain}
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/20"
                          >
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        Posted by <Button variant="link" className="h-auto p-0">{selectedJob.postedBy}</Button>
                      </span>
                      <Button onClick={handleApplyClick}>Apply Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-lg mb-2">Select a job to view details</h3>
                    <p className="text-muted-foreground max-w-md">
                      Click on a job listing to view its complete description, requirements, and application details.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Job Application Dialog */}
      <Dialog
        open={isApplicationDialogOpen}
        onOpenChange={setIsApplicationDialogOpen}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Write a brief message about why you're interested in this position at {selectedJob?.company}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="cover-letter">Cover Letter</Label>
                <Textarea
                  id="cover-letter"
                  className="mt-2 min-h-[200px]"
                  placeholder="Introduce yourself, highlight your skills and qualifications, and explain why you're a good fit for this position..."
                  value={applicationText}
                  onChange={(e) => setApplicationText(e.target.value)}
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Your profile information will be automatically included with your application.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsApplicationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleApplicationSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
                  Submitting...
                </div>
              ) : "Submit Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;

