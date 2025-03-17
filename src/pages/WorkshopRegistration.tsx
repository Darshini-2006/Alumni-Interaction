
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from '@/App';

// Sample workshops
const availableWorkshops = [
  {
    id: "ws1",
    title: "Career Development for Engineers",
    date: "June 15, 2023",
    time: "10:00 AM - 2:00 PM",
    location: "Engineering Building, Room 305",
    instructor: "Dr. James Wilson",
    limited: true,
    maxParticipants: 30
  },
  {
    id: "ws2",
    title: "Entrepreneurship Bootcamp",
    date: "June 22, 2023",
    time: "9:00 AM - 5:00 PM",
    location: "Business School, Conference Hall B",
    instructor: "Sarah Johnson, MBA",
    limited: true,
    maxParticipants: 25
  },
  {
    id: "ws3",
    title: "Data Science Fundamentals",
    date: "June 29, 2023",
    time: "1:00 PM - 5:00 PM",
    location: "Computer Science Building, Lab 2",
    instructor: "Dr. Michael Chen",
    limited: true,
    maxParticipants: 20
  }
];

const workshopRegistrationSchema = z.object({
  workshopId: z.string({
    required_error: "Please select a workshop",
  }),
  reasonForAttending: z.string().min(10, {
    message: "Reason must be at least 10 characters",
  }).max(500, {
    message: "Reason must not exceed 500 characters",
  }),
  experience: z.string().min(5, {
    message: "Experience details must be at least 5 characters",
  }),
  dietaryRestrictions: z.string().optional(),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type WorkshopRegistrationFormValues = z.infer<typeof workshopRegistrationSchema>;

const WorkshopRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const form = useForm<WorkshopRegistrationFormValues>({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      workshopId: "",
      reasonForAttending: "",
      experience: "",
      dietaryRestrictions: "",
      agreeToTerms: false,
    },
  });

  const selectedWorkshopId = form.watch('workshopId');
  const selectedWorkshop = availableWorkshops.find(ws => ws.id === selectedWorkshopId);

  const onSubmit = async (values: WorkshopRegistrationFormValues) => {
    setIsLoading(true);
    try {
      console.log("Workshop registration form values:", values);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Workshop registration successful!");
      navigate('/forums');
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Workshop Registration</h1>
          <p className="text-muted-foreground mb-8">Register for upcoming workshops and seminars</p>
          
          <Card>
            <CardHeader>
              <CardTitle>Workshop Enrollment Form</CardTitle>
              <CardDescription>
                Please complete all required fields to register for a workshop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="workshopId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Workshop</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a workshop" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableWorkshops.map(workshop => (
                              <SelectItem key={workshop.id} value={workshop.id}>
                                {workshop.title} - {workshop.date}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {selectedWorkshop && (
                    <div className="bg-primary/5 p-4 rounded-md border border-primary/20 mb-4">
                      <h3 className="font-medium text-lg mb-2">{selectedWorkshop.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><span className="font-medium">Date:</span> {selectedWorkshop.date}</p>
                        <p><span className="font-medium">Time:</span> {selectedWorkshop.time}</p>
                        <p><span className="font-medium">Location:</span> {selectedWorkshop.location}</p>
                        <p><span className="font-medium">Instructor:</span> {selectedWorkshop.instructor}</p>
                      </div>
                      {selectedWorkshop.limited && (
                        <p className="text-sm mt-2 text-yellow-600 dark:text-yellow-400">
                          Limited to {selectedWorkshop.maxParticipants} participants
                        </p>
                      )}
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="reasonForAttending"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to attend this workshop?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please explain why you're interested in this workshop and what you hope to gain from it"
                            className="resize-none min-h-[100px]"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relevant Experience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your experience or background relevant to this workshop"
                            className="resize-none"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dietary Restrictions (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Please specify any dietary restrictions or allergies"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the workshop terms and conditions
                          </FormLabel>
                          <FormDescription>
                            By agreeing, you confirm your attendance and understand the workshop policies.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end space-x-4">
                    <Button variant="outline" type="button" onClick={() => navigate('/forums')}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Submitting..." : "Register for Workshop"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WorkshopRegistration;
