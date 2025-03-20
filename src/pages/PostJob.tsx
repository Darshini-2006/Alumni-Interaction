import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path based on your project structure

// Define validation schema with the additional "applyLink" field
const jobSchema = z.object({
  title: z.string().min(3, "Job title must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(3, "Location is required"),
  type: z.enum(["Full-time", "Internship"]),
  salary: z.string().optional(),
  role: z.string().min(5, "Job role description must be at least 5 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  eligibility: z.string().min(5, "Eligibility details must be at least 5 characters"),
  applyLink: z.string().url("Please enter a valid URL"),
});

type JobFormValues = z.infer<typeof jobSchema>;

const PostJob = () => {
  const [jobType, setJobType] = useState("Full-time");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      type: "Full-time",
      salary: "",
      role: "",
      requirements: "",
      eligibility: "",
      applyLink: "",
    },
  });

  // Handle form submission and add data to Firestore
  const onSubmit = async (data: JobFormValues) => {
    setIsSubmitting(true);
    try {
      // Add job data to the "jobs" collection in Firestore
      await addDoc(collection(db, "jobs"), {
        ...data,
        createdAt: new Date(),
      });
      toast.success("Job posted successfully!");
      form.reset();
      navigate("/jobs"); // Redirect after successful post
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error("Failed to post job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Post a Job</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Job Title */}
          <FormField control={form.control} name="title" render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Company Name */}
          <FormField control={form.control} name="company" render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Google" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Location */}
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., New York, USA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Job Type */}
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  setJobType(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {/* Salary (Only for Full-time) */}
          {jobType === "Full-time" && (
            <FormField control={form.control} name="salary" render={({ field }) => (
              <FormItem>
                <FormLabel>Salary (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., $80,000 per year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          {/* Job Role */}
          <FormField control={form.control} name="role" render={({ field }) => (
            <FormItem>
              <FormLabel>Job Role</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the role and responsibilities..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Requirements */}
          <FormField control={form.control} name="requirements" render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea placeholder="List the required skills and qualifications..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Eligibility */}
          <FormField control={form.control} name="eligibility" render={({ field }) => (
            <FormItem>
              <FormLabel>Eligibility</FormLabel>
              <FormControl>
                <Textarea placeholder="Mention who is eligible for this role..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Apply Link */}
          <FormField control={form.control} name="applyLink" render={({ field }) => (
            <FormItem>
              <FormLabel>Link to Apply</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://company.com/apply" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Job"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PostJob;
