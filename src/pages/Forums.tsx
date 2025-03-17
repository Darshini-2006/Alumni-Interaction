
import { useState, useEffect } from 'react';
import { useAuth } from '@/App';
import { MessageSquare, Plus, Search, Users, ArrowUpRight, MessageCircleMore, GraduationCap, UserCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { availableForums } from '@/pages/Register';

// Sample user data
const sampleUsers = {
  students: 156,
  alumni: 87,
  staff: 12
};

// Sample forum membership data
const forumMembershipData = {
  'general': { students: 156, alumni: 87, staff: 12 },
  'software-it': { students: 43, alumni: 24, staff: 3 },
  'mechanical': { students: 37, alumni: 18, staff: 2 },
  'electrical': { students: 28, alumni: 12, staff: 2 },
  'cse': { students: 48, alumni: 31, staff: 4 },
  'entrepreneurship': { students: 34, alumni: 22, staff: 3 },
};

// Sample forum data with membership counts
const forumData = {
  domains: availableForums.map(forum => ({
    id: forum.id,
    name: forum.name,
    description: forum.description,
    topics: Math.floor(Math.random() * 20) + 5, // Random number between 5-25
    members: forum.id === 'general' 
      ? sampleUsers.students + sampleUsers.alumni + sampleUsers.staff
      : (forumMembershipData[forum.id]?.students || 0) + 
        (forumMembershipData[forum.id]?.alumni || 0) + 
        (forumMembershipData[forum.id]?.staff || 0),
    icon: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 10000)}`,
    isDefault: forum.isDefault
  })),
  popular: [
    {
      id: 1,
      title: 'How to prepare for technical interviews at FAANG companies?',
      author: 'Emily Johnson',
      authorRole: 'Google, Senior Engineer',
      domain: 'Software & IT',
      replies: 34,
      views: 1245,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      title: 'The future of renewable energy: Trends and career opportunities',
      author: 'Michael Chen',
      authorRole: 'Tesla, Energy Engineer',
      domain: 'Environmental & Energy Engineering',
      replies: 28,
      views: 876,
      lastActivity: '5 hours ago',
    },
    {
      id: 3,
      title: 'From college project to successful startup: My journey',
      author: 'Sarah Wilson',
      authorRole: 'TechStart, Founder & CEO',
      domain: 'Entrepreneurship & Innovation',
      replies: 42,
      views: 1567,
      lastActivity: '1 day ago',
    },
    {
      id: 4,
      title: 'Machine Learning vs Deep Learning: What should students focus on?',
      author: 'David Patel',
      authorRole: 'Microsoft, AI Researcher',
      domain: 'Computer Science & Engineering',
      replies: 19,
      views: 689,
      lastActivity: '2 days ago',
    },
  ],
  recent: [
    {
      id: 5,
      title: 'Best resources for learning cloud architecture in 2023',
      author: 'Lisa Wang',
      authorRole: 'AWS, Solutions Architect',
      domain: 'Software & IT',
      replies: 7,
      views: 142,
      lastActivity: '30 minutes ago',
    },
    {
      id: 6,
      title: 'Internship experience at SpaceX: What to expect',
      author: 'James Rodriguez',
      authorRole: 'SpaceX, Propulsion Engineer',
      domain: 'Aerospace Engineering',
      replies: 12,
      views: 324,
      lastActivity: '1 hour ago',
    },
    {
      id: 7,
      title: 'How to balance academics and entrepreneurship as a student',
      author: 'Priya Sharma',
      authorRole: 'EdTech Startup, Co-founder',
      domain: 'Entrepreneurship & Innovation',
      replies: 15,
      views: 289,
      lastActivity: '3 hours ago',
    },
    {
      id: 8,
      title: 'Latest advancements in robotics: Industry perspectives',
      author: 'Kevin Park',
      authorRole: 'Boston Dynamics, Robotics Engineer',
      domain: 'Mechanical Engineering',
      replies: 8,
      views: 176,
      lastActivity: '6 hours ago',
    },
  ],
};

const Forums = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isLoggedIn } = useAuth();
  
  // Mock user role - in a real app, this would come from authentication
  const [userRole, setUserRole] = useState('student'); // Options: 'student', 'alumni', 'staff'
  
  // Function to filter discussions by search query
  const filterDiscussions = (discussions) => {
    if (!searchQuery) return discussions;
    return discussions.filter((discussion) => 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filtered discussions based on search
  const filteredPopularDiscussions = filterDiscussions(forumData.popular);
  const filteredRecentDiscussions = filterDiscussions(forumData.recent);

  // Function to get access status for a forum based on user role
  const getForumAccessStatus = (forumId) => {
    if (userRole === 'staff') return 'accessible'; // Staff have access to all forums
    if (forumId === 'general') return 'accessible'; // General forum is accessible to all
    
    // In a real app, you would check if the user has joined this forum
    return 'accessible'; // For demo purposes
  };

  // Get domains for display based on user role
  const getDisplayDomains = () => {
    // Staff can access all forums
    if (userRole === 'staff') return forumData.domains;
    
    // For students and alumni, we'd filter based on joined forums
    // For the demo, we just show all
    return forumData.domains;
  };

  const displayDomains = getDisplayDomains();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <section className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
                Discussion Forums
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Engage in domain-specific discussions, ask questions, and share knowledge with fellow students and alumni.
              </p>
            </div>
            <Button className="mt-4 md:mt-0 gap-2">
              <Plus className="h-4 w-4" />
              New Discussion
            </Button>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="glass-card border-none">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Students</h3>
                  <p className="text-2xl font-bold">{sampleUsers.students}</p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-none">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Alumni</h3>
                  <p className="text-2xl font-bold">{sampleUsers.alumni}</p>
                </div>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <UserCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-none">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Staff</h3>
                  <p className="text-2xl font-bold">{sampleUsers.staff}</p>
                </div>
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search bar */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Domain categories */}
          <h2 className="font-semibold text-xl mb-4">Domain Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {displayDomains.map((domain) => {
              const isGeneralForum = domain.id === 'general';
              const accessStatus = getForumAccessStatus(domain.id);
              
              return (
                <Card 
                  key={domain.id} 
                  className={`overflow-hidden glass-card border-none hover:shadow-md transition-shadow duration-300 ${
                    isGeneralForum ? 'border-l-4 border-l-primary' : ''
                  }`}
                >
                  <CardContent className="p-0">
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md overflow-hidden">
                            <img 
                              src={domain.icon} 
                              alt={domain.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{domain.name}</h3>
                            {isGeneralForum && (
                              <Badge variant="outline" className="mt-1">Default Forum</Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Membership status indicator - would show if user has joined this forum */}
                        {isGeneralForum && (
                          <Badge variant="secondary">Member</Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                        {domain.description}
                      </p>
                      
                      {/* Forum member counts */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          <span>{forumMembershipData[domain.id]?.students || 0} students</span>
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <UserCircle className="h-3 w-3" />
                          <span>{forumMembershipData[domain.id]?.alumni || 0} alumni</span>
                        </Badge>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <span>{forumMembershipData[domain.id]?.staff || 0} staff</span>
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                        <span className="flex items-center">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          {domain.topics} topics
                        </span>
                        <span className="flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1" />
                          {domain.members} members
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-border p-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-between"
                      >
                        <span>View Forum</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Discussions tabs */}
          <Tabs defaultValue="popular" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="popular">Popular Discussions</TabsTrigger>
              <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="popular">
              <div className="space-y-4">
                {filteredPopularDiscussions.length > 0 ? (
                  filteredPopularDiscussions.map((discussion) => (
                    <DiscussionItem key={discussion.id} discussion={discussion} />
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No discussions found matching your search.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="recent">
              <div className="space-y-4">
                {filteredRecentDiscussions.length > 0 ? (
                  filteredRecentDiscussions.map((discussion) => (
                    <DiscussionItem key={discussion.id} discussion={discussion} />
                  ))
                ) : (
                  <p className="text-center py-8 text-muted-foreground">No discussions found matching your search.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Footer />
    </div>
  );
};

// Discussion item component
const DiscussionItem = ({ discussion }: { discussion: typeof forumData.popular[0] }) => {
  return (
    <div className="glass-card border-none rounded-lg p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium text-lg hover:text-primary cursor-pointer transition-colors">
            {discussion.title}
          </h3>
          <div className="flex items-center mt-2 text-sm">
            <span className="text-muted-foreground">Posted by </span>
            <Button variant="link" className="h-auto p-0 ml-1 font-medium">
              {discussion.author}
            </Button>
            <span className="text-xs text-muted-foreground ml-1">
              ({discussion.authorRole})
            </span>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {discussion.domain}
        </span>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span className="flex items-center">
            <MessageCircleMore className="h-3.5 w-3.5 mr-1" />
            {discussion.replies} replies
          </span>
          <span className="flex items-center">
            <Users className="h-3.5 w-3.5 mr-1" />
            {discussion.views} views
          </span>
        </div>
        <span>Last activity: {discussion.lastActivity}</span>
      </div>
    </div>
  );
};

export default Forums;
