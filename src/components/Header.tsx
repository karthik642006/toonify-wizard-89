
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

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
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Sparkles className="w-6 h-6 text-toon-blue" />
          <span className="font-semibold text-xl tracking-tight">Toonify</span>
        </motion.div>
        
        <motion.nav 
          className="flex gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <a 
            href="#" 
            className="text-sm font-medium hover:text-toon-blue transition-colors px-3 py-2 rounded-md"
          >
            Home
          </a>
          <a 
            href="#gallery" 
            className="text-sm font-medium hover:text-toon-blue transition-colors px-3 py-2 rounded-md"
          >
            Gallery
          </a>
          <a 
            href="#about" 
            className="text-sm font-medium hover:text-toon-blue transition-colors px-3 py-2 rounded-md"
          >
            About
          </a>
        </motion.nav>
      </div>
    </motion.header>
  );
};

export default Header;
