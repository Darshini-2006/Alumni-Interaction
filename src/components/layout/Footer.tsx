
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Github } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Footer links organized by section
  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Alumni Network', path: '/alumni' },
        { name: 'Forums', path: '/forums' },
        { name: 'Jobs & Internships', path: '/jobs' },
        { name: 'Events & Webinars', path: '/events' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Support', path: '#' },
        { name: 'Documentation', path: '#' },
        { name: 'Privacy Policy', path: '#' },
        { name: 'Terms of Service', path: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'Contact Us', path: '#' },
        { name: 'Feedback', path: '#' },
        { name: 'Blog', path: '#' },
      ],
    },
  ];

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: Facebook, path: '#' },
    { name: 'Twitter', icon: Twitter, path: '#' },
    { name: 'LinkedIn', icon: Linkedin, path: '#' },
    { name: 'Instagram', icon: Instagram, path: '#' },
    { name: 'GitHub', icon: Github, path: '#' },
  ];

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Connect with alumni, find mentorship, and explore career opportunities through our platform designed to bridge the gap between students and professionals.
            </p>
            <div className="mt-6 flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.path}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Scholar Connect. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link to="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Cookies Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
