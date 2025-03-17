
import { Link } from 'react-router-dom';

type LogoProps = {
  className?: string;
};

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <div className="font-display text-xl font-semibold tracking-tight text-primary">
        Scholar<span className="text-primary/80">Connect</span>
      </div>
    </Link>
  );
};

export default Logo;
