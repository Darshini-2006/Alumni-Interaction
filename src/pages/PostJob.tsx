
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Save, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Form schema
const formSchema = z.object({
  title: z.string().min(5, { message: 'Job title must be at least 5 characters' }),
  company: z.string().min(2, { message: 'Company name is required' }),
  location: z.string().min(3, { message: 'Location is required' }),
  type: z.string(),
  salary: z.string(),
  description: z.string().min(30, { message: 'Description must be at least 30 characters' }),
  requirements: z.string().min(30, { message: 'Requirements must be at least 30 characters' }),
  domains: z.array(z.string()).min(1, { message: 'Select at least one domain' }),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
});

// Domain options
const domainOptions = [
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

// Job types
const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract'];

const PostJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with zod schema
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      type: 'Full-time',
      salary: '',
      description: '',
      requirements: '',
      domains: [],
      agreeToTerms: false,
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      console.log('Job posting form submitted:', values);
      
      // Success message 
      toast.success('Job posted successfully!', {
        description: 'Your job has been posted and is now visible to students.',
      });
      
      // Reset form
      form.reset();
      setIsSubmitting(false);
      
      // Redirect to jobs page
      navigate('/jobs');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <Button 
              variant="outline" 
              className="mb-6" 
              onClick={() => navigate('/jobs')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <PenLine className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                  Post a Job
                </h1>
                <p className="text-muted-foreground mt-1">
                  Share opportunities with students and fellow alumni
                </p>
              </div>
            </div>
            
            <div className="glass-card border-none rounded-xl p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Job Details Section */}
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-2">Job Details</h2>
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Google" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {jobTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="salary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Salary Range</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. $80,000 - $100,000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  {/* Description and Requirements */}
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-2">Description & Requirements</h2>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the role, responsibilities, and what the candidate will be doing"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List the skills, qualifications, and experience required for this position"
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Domains & Categories */}
                  <div className="space-y-4">
                    <h2 className="font-semibold text-lg border-b pb-2">Domains & Categories</h2>
                    
                    <FormField
                      control={form.control}
                      name="domains"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel>Related Domains</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Select domains related to this job opportunity
                            </p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {domainOptions.map((domain) => (
                              <FormField
                                key={domain}
                                control={form.control}
                                name="domains"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={domain}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(domain)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, domain])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== domain
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        {domain}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* Terms */}
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I confirm that this job posting complies with the terms of use and is a legitimate opportunity
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 border-t flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="min-w-[120px]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin"></div>
                          Posting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Save className="h-4 w-4" />
                          Post Job
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
