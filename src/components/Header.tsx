
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles, Search, Bell, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        {/* Profile icon on the left */}
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Link to="/profile" className="p-2 rounded-full hover:bg-gray-100/50 transition-colors">
            <UserRound className="w-5 h-5" />
          </Link>
        </motion.div>
        
        {/* App name in the center */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Sparkles className="w-6 h-6 text-toon-blue" />
          <span className="font-semibold text-xl tracking-tight">Toonify</span>
        </motion.div>
        
        {/* Search and notification icons on the right */}
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <button className="p-2 rounded-full hover:bg-gray-100/50 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100/50 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
