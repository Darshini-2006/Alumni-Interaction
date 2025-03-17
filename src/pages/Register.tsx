
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import RoleSelector from '@/components/shared/RoleSelector';
import StudentForm from '@/components/registration/StudentForm';
import AlumniForm from '@/components/registration/AlumniForm';
import StaffForm from '@/components/registration/StaffForm';

// Available forums data for selection
export const availableForums = [
  {
    id: 'general',
    name: 'General Forum',
    description: 'Open discussions for all members of the college community',
    isDefault: true
  },
  {
    id: 'software-it',
    name: 'Software & IT',
    description: 'Discussions on software development, programming languages, cybersecurity, and IT solutions',
    isDefault: false
  },
  {
    id: 'mechanical',
    name: 'Mechanical Engineering',
    description: 'Topics covering design, manufacturing, robotics, automotive engineering, and advanced machinery',
    isDefault: false
  },
  {
    id: 'electrical',
    name: 'Electrical & Electronics',
    description: 'Focus on circuit design, embedded systems, power systems, and communication technologies',
    isDefault: false
  },
  {
    id: 'cse',
    name: 'Computer Science & Engineering',
    description: 'Algorithms, data structures, AI, machine learning, and big data',
    isDefault: false
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship & Innovation',
    description: 'Sharing startup ideas, innovation strategies, leadership experiences, and venture funding',
    isDefault: false
  },
];

const Register = () => {
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get role from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    if (role) {
      setSelectedRole(role);
      setIsRoleSelectorOpen(false);
    }
  }, [location.search]);

  const handleClose = () => {
    setIsRoleSelectorOpen(false);
    navigate('/');
  };

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setIsRoleSelectorOpen(false);
    navigate(`/register?role=${role}`, { replace: true });
  };

  const renderForm = () => {
    switch (selectedRole) {
      case 'student':
        return <StudentForm availableForums={availableForums} />;
      case 'alumni':
        return <AlumniForm availableForums={availableForums} />;
      case 'staff':
        return <StaffForm />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-lg">
        {isRoleSelectorOpen ? (
          <RoleSelector onClose={handleClose} onRoleSelect={handleRoleSelect} />
        ) : (
          renderForm()
        )}
      </div>
    </div>
  );
};

export default Register;
