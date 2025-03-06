
import { motion } from 'framer-motion';
import { Home, Film, Upload, Briefcase, UserRound } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};

const BottomNavigation = () => {
  const [activeItem, setActiveItem] = useState('home');
  
  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Film, label: 'Clips', href: '#clips' },
    { icon: Upload, label: 'Upload', href: '#upload' },
    { icon: Briefcase, label: 'Jobs', href: '#jobs' },
    { icon: UserRound, label: 'Profile', href: '#profile' },
  ];
  
  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 glass shadow-lg rounded-t-xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="flex justify-between items-center px-6 py-3">
        {navItems.map((item) => (
          <NavItem 
            key={item.label}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={activeItem === item.label.toLowerCase()}
            onClick={() => setActiveItem(item.label.toLowerCase())}
          />
        ))}
      </div>
    </motion.div>
  );
};

const NavItem = ({ 
  icon: Icon, 
  label, 
  href, 
  isActive,
  onClick
}: NavItem & { 
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <Link 
      to={href} 
      className="flex flex-col items-center"
      onClick={onClick}
    >
      <div className={`p-2 rounded-full ${isActive ? 'bg-toon-blue/10' : ''}`}>
        <Icon 
          className={`w-6 h-6 ${isActive ? 'text-toon-blue' : 'text-gray-500'}`} 
        />
      </div>
      <span className={`text-xs mt-1 ${isActive ? 'text-toon-blue font-medium' : 'text-gray-500'}`}>
        {label}
      </span>
    </Link>
  );
};

export default BottomNavigation;
