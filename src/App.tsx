import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, createContext, useContext } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";  // ✅ Added Signup Page
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Forums from "./pages/Forums";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import Profile from "./pages/Profile";
import WorkshopRegistration from "./pages/WorkshopRegistration";
import Alumni from "./pages/Alumni";

const queryClient = new QueryClient();

// Create a simple auth context
type AuthContextType = {
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (userData?: UserProfile) => void;
  logout: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
};

export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePhoto?: string;
};

// Default user data for testing
const defaultUser: UserProfile = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "alumni"
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
  updateUser: () => {}
});

export const useAuth = () => useContext(AuthContext);

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  const login = (userData?: UserProfile) => {
    setIsLoggedIn(true);
    setUser(userData || defaultUser);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };
  
  const updateUser = (data: Partial<UserProfile>) => {
    if (user) {
      setUser({...user, ...data});
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isLoggedIn, user, login, logout, updateUser }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} /> {/* ✅ Added Signup Route */}
              <Route path="/forums" element={<Forums />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route 
                path="/post-job" 
                element={
                  <ProtectedRoute>
                    <PostJob />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <ProtectedRoute>
                    <Register />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                    <Profile />
                } 
              />
              <Route 
                path="/workshop-registration" 
                element={
                  <ProtectedRoute>
                    <WorkshopRegistration />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
