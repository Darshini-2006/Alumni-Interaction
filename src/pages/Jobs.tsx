import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Briefcase, MapPin, Clock, Calendar, 
  ExternalLink, Filter, Check, ChevronDown, PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  postedDate?: string;
  postedBy?: string;
  logo?: string;
  description?: string;
  requirements?: string[];  // Expected to be an array
  domains?: string[];
  applyLink?: string;
  role?: string;
  eligibility?: string;
}

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
  const [jobsData, setJobsData] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch jobs from Firestore when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobs: Job[] = [];
        querySnapshot.forEach((doc) => {
          jobs.push({
            id: doc.id,
            ...doc.data(),
          } as Job);
        });
        setJobsData(jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on search query and selected filters
  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesJobType = 
      selectedJobTypes.length === 0 || 
      selectedJobTypes.includes(job.type);
    
    const matchesDomains = 
      selectedDomains.length === 0 || 
      (job.domains && job.domains.some(domain => selectedDomains.includes(domain)));
    
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

  const handlePostJobClick = () => {
    if (!isLoggedIn) {
      toast.error("You need to log in to post jobs", {
        description: "Please log in or register to post a job."
      });
      return;
    }
    navigate('/post-job');
  };

  // When "Apply Now" is clicked, open the URL provided in applyLink
  const handleDirectApply = () => {
    if (selectedJob?.applyLink) {
      window.open(selectedJob.applyLink, "_blank");
    } else {
      toast.error("No application link provided for this job.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Pass the selected job's applyLink to the Header */}
      <Header applyLink={selectedJob?.applyLink} />
      
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

          {/* Search and Filters */}
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

          {/* Job Listings */}
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading jobs...
            </div>
          ) : (
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
                        onClick={() => {
                          setSelectedJob(job);
                          console.log('Selected job:', job);
                        }}
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
                            {job.salary}
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
                        <Button className="gap-2" onClick={handleDirectApply}>
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
                          <span>Posted {selectedJob.postedDate || "recently"}</span>
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

                      {selectedJob.role && (
                        <div className="mb-6">
                          <h3 className="font-semibold mb-2">Job Role</h3>
                          <p className="text-muted-foreground">{selectedJob.role}</p>
                        </div>
                      )}

                      {selectedJob.eligibility && (
                        <div className="mb-6">
                          <h3 className="font-semibold mb-2">Eligibility</h3>
                          <p className="text-muted-foreground">{selectedJob.eligibility}</p>
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Requirements</h3>
                        <ul className="list-disc pl-6 text-muted-foreground">
                          {(Array.isArray(selectedJob.requirements) ? selectedJob.requirements : []).map((req, index) => (
                            <li key={index} className="mb-1">{req}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-semibold mb-2">Domains</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.domains?.map((domain) => (
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
                        <Button onClick={handleDirectApply}>Apply Now</Button>
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
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
