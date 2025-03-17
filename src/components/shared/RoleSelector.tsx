
import { UserCircle, Users, GraduationCap, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';

type RoleSelectorProps = {
  onClose: () => void;
  onRoleSelect: (role: string) => void;
};

const RoleSelector = ({ onClose, onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Connect with alumni, find mentors, and explore opportunities',
      icon: GraduationCap,
    },
    {
      id: 'alumni',
      title: 'Alumni',
      description: 'Mentor students, share opportunities, and stay connected',
      icon: Users,
    },
    {
      id: 'staff',
      title: 'Staff',
      description: 'Manage college initiatives and facilitate connections',
      icon: Building,
    },
  ];

  return (
    <div className="glass-card rounded-xl p-6 w-full max-w-lg animate-scale-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Select your role</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </div>
      
      <div className="grid gap-4">
        {roles.map((role) => {
          const Icon = role.icon;
          
          return (
            <button 
              key={role.id}
              onClick={() => onRoleSelect(role.id)}
              className="group flex items-start border border-border/50 rounded-lg p-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 w-full text-left"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary mr-4 group-hover:bg-primary/20 transition-colors duration-300">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-base">{role.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
