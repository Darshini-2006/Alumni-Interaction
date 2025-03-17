import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload } from 'lucide-react';
import { useAuth } from '@/App';

// Import Firestore functions from Firebase
import { getFirestore, collection, addDoc } from 'firebase/firestore';

interface Forum {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
}

interface AlumniFormProps {
  availableForums: Forum[];
}

const alumniSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  graduationYear: z.string().min(4, { message: "Please enter a valid graduation year" }),
  degree: z.string().min(2, { message: "Please enter your degree" }),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  bio: z.string().optional(),
  forums: z.array(z.string())
    .refine((value) => {
      // Must include general forum and at most 2 domain forums
      const generalForumIncluded = value.includes('general');
      const domainForumsCount = value.filter(id => id !== 'general').length;
      return generalForumIncluded && domainForumsCount <= 2;
    }, { 
      message: "You must join the General forum and can select up to 2 additional forums" 
    }),
});

type AlumniFormValues = z.infer<typeof alumniSchema>;

const AlumniForm = ({ availableForums }: AlumniFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  // Initialize Firestore
  const db = getFirestore();

  // Get the general forum and domain forums
  const generalForum = availableForums.find(forum => forum.id === 'general');
  const domainForums = availableForums.filter(forum => !forum.isDefault);

  const form = useForm<AlumniFormValues>({
    resolver: zodResolver(alumniSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      graduationYear: "",
      degree: "",
      company: "",
      jobTitle: "",
      bio: "",
      forums: generalForum ? [generalForum.id] : [],
    },
  });

  const watchedForums = form.watch('forums');
  const selectedDomainForumsCount = watchedForums.filter(id => id !== 'general').length;
  const remainingForumSelections = 2 - selectedDomainForumsCount;

  const handleProfilePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: AlumniFormValues) => {
    setIsLoading(true);
    try {
      console.log("Alumni registration form values:", values);

      // Prepare alumni data to store in Firestore
      const alumniData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        graduationYear: values.graduationYear,
        degree: values.degree,
        company: values.company || "",
        jobTitle: values.jobTitle || "",
        bio: values.bio || "",
        forums: values.forums,
        profilePhoto: profilePhoto || null,
        createdAt: new Date()
      };

      // Store the alumni data in the "alumni" collection in Firestore
      await addDoc(collection(db, "alumni"), alumniData);

      // Optionally update the user profile in your auth context
      updateUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        profilePhoto: profilePhoto || undefined
      });
      
      toast.success("Registration successful! Welcome to our alumni network.");
      navigate('/forums');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Alumni Registration</h2>
        <p className="text-muted-foreground mt-1">Connect with current students and fellow alumni</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Avatar 
            className="h-24 w-24 border-2 border-primary cursor-pointer"
            onClick={handleProfilePhotoClick}
          >
            {profilePhoto ? (
              <AvatarImage src={profilePhoto} alt="Profile photo" />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                <Camera className="h-8 w-8" />
              </AvatarFallback>
            )}
          </Avatar>
          <div 
            className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full cursor-pointer"
            onClick={handleProfilePhotoClick}
          >
            <Upload className="h-4 w-4" />
          </div>
          <p className="text-sm text-center mt-2 text-muted-foreground">
            Click to upload profile photo
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="you@example.com" 
                    type="email" 
                    {...field} 
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="graduationYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="2020" 
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
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your degree" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">Ph.D</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Company</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Company Name" 
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
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Software Engineer" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Short Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about yourself..."
                    className="resize-none"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-medium mb-2">Forum Memberships</h3>
              <p className="text-sm text-muted-foreground mb-4">
                As an alumni, you're automatically a member of the General Forum and can join up to 2 domain-specific forums
              </p>
            </div>
            
            {/* Default forum (always selected and disabled) */}
            {generalForum && (
              <Card className="border border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked disabled />
                    <div>
                      <p className="font-medium">{generalForum.name}</p>
                      <p className="text-sm text-muted-foreground">{generalForum.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Domain-specific forums */}
            <FormField
              control={form.control}
              name="forums"
              render={() => (
                <FormItem>
                  <div className="space-y-3">
                    {domainForums.map((forum) => (
                      <FormField
                        key={forum.id}
                        control={form.control}
                        name="forums"
                        render={({ field }) => {
                          const isSelected = field.value?.includes(forum.id);
                          const isDisabled = !isSelected && selectedDomainForumsCount >= 2;
                          
                          return (
                            <FormItem
                              key={forum.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isSelected}
                                  disabled={isLoading || isDisabled}
                                  onCheckedChange={(checked) => {
                                    const updatedValue = checked
                                      ? [...field.value, forum.id]
                                      : field.value?.filter((value) => value !== forum.id);
                                    field.onChange(updatedValue);
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-base">
                                  {forum.name}
                                </FormLabel>
                                <FormDescription>
                                  {forum.description}
                                </FormDescription>
                              </div>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                  {remainingForumSelections > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      You can select {remainingForumSelections} more forum{remainingForumSelections !== 1 ? 's' : ''}
                    </p>
                  )}
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-6 flex justify-end space-x-4">
            <Button variant="outline" type="button" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AlumniForm;
