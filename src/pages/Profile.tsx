import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, User, Mail, Briefcase, GraduationCap, Building2, ScrollText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { app } from '../../firebase';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | undefined>(user?.profilePhoto);
  const [authUser, setAuthUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const db = getFirestore(app);
  const auth = getAuth(app);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Fetch user data when auth user is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser?.email) {
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching data for email:", authUser.email); // Debug log
        const alumniRef = collection(db, "alumni");
        const q = query(alumniRef, where("email", "==", authUser.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          console.log("Found user data:", userData); // Debug log
          setProfileData(userData);
          if (userData.profilePhoto) {
            setProfilePhoto(userData.profilePhoto);
          }
          
          // Update auth context with user data
          updateUser({
            id: authUser.uid,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'alumni',
            profilePhoto: userData.profilePhoto
          });
        } else {
          console.log("No matching documents found"); // Debug log
          toast.error("Profile data not found. Please complete your registration.");
          navigate('/register');
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      fetchUserData();
    }
  }, [authUser, db, navigate, updateUser]);

  const handleProfilePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setProfilePhoto(result);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error uploading profile photo:", error);
        toast.error("Failed to update profile photo");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Please log in to view your profile</p>
          <Button className="mt-4" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-muted-foreground">Profile not found</p>
          <p className="text-sm text-muted-foreground">Please complete your registration to continue</p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate('/forums')}>
              Go Back
            </Button>
            <Button onClick={() => navigate('/register')}>
              Complete Registration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                <Avatar 
                  className="h-32 w-32 border-4 border-primary/20 cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={handleProfilePhotoClick}
                >
                  {profilePhoto ? (
                    <AvatarImage src={profilePhoto} alt="Profile photo" />
                  ) : (
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-12 w-12 text-primary" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div 
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                  onClick={handleProfilePhotoClick}
                >
                  <Camera className="h-5 w-5" />
                </div>
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-lg text-muted-foreground mt-2">
                  {profileData.jobTitle} {profileData.company && `at ${profileData.company}`}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                  {profileData.forums?.map((forum: string) => (
                    <span 
                      key={forum}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {forum}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{profileData.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Education</p>
                      <p className="font-medium">{profileData.degree}</p>
                      <p className="text-sm text-muted-foreground">Class of {profileData.graduationYear}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Job Title</p>
                      <p className="font-medium">{profileData.jobTitle || 'Not specified'}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{profileData.company || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card className="md:col-span-2">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <ScrollText className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Bio</h2>
                    <p className="text-muted-foreground">
                      {profileData.bio || 'No bio provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate('/forums')}>
              Back to Forums
            </Button>
            <Button onClick={() => navigate('/profile/edit')}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;