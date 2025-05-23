import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, User, Users, Briefcase, Calendar, 
  MessageSquare, LogIn, LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/ui/Logo';
import { auth } from '../../../firebase.js'; // Adjust the path to your firebase config file
import { onAuthStateChanged, signOut } from 'firebase/auth';

interface HeaderProps {
  applyLink?: string;
}

const Header = ({ applyLink }: HeaderProps) => {
  console.log("Header applyLink:", applyLink);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Handle window scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Alumni', path: '/alumni', icon: Users },
    { name: 'Forums', path: '/forums', icon: MessageSquare },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Events', path: '/events', icon: Calendar },
  ];

  // Hide "Home" if the user is logged in
  const filteredNavItems = isLoggedIn ? navItems.filter(item => item.name !== 'Home') : navItems;

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="z-10">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {filteredNavItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`relative text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path 
                  ? 'text-primary after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[2px] after:bg-primary after:opacity-80' 
                  : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Render the Apply button if applyLink is provided */}
          {applyLink && (
            <Button variant="outline" size="sm" onClick={() => window.open(applyLink, '_blank')}>
              Apply
            </Button>
          )}
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="text-sm font-medium" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="text-sm font-medium relative overflow-hidden group">
                  <span className="relative z-10">Register</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-10 p-2"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-primary" />
          ) : (
            <Menu className="h-6 w-6 text-primary" />
          )}
        </button>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 glass md:hidden transform ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-300 ease-in-out z-0`}
        >
          <div className="flex flex-col h-full pt-20 p-6 space-y-6">
            {filteredNavItems.map((item) => {
              const Icon = item.icon || User;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-primary/5'
                  }`}
                  onClick={closeMobileMenu}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-border pt-6 mt-auto">
              <div className="grid grid-cols-2 gap-3">
                {applyLink && (
                  <Button variant="outline" className="w-full" onClick={() => { window.open(applyLink, '_blank'); closeMobileMenu(); }}>
                    Apply
                  </Button>
                )}
                {isLoggedIn ? (
                  <>
                    <Link to="/profile" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Button>
                    </Link>
                    <Button className="w-full" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full">
                        <LogIn className="h-4 w-4 mr-2" />
                        Log In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu}>
                      <Button className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
