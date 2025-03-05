
import { Heart, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="py-8 px-6 mt-12"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Toonify Wizard. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-toon-blue transition-colors"
            >
              Terms
            </a>
            <a 
              href="#" 
              className="text-sm text-gray-600 hover:text-toon-blue transition-colors"
            >
              Privacy
            </a>
            <motion.a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-toon-blue transition-colors flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
            >
              <Github className="w-4 h-4" />
            </motion.a>
          </div>
          
          <motion.div 
            className="flex items-center gap-1.5 text-sm text-gray-600"
            whileHover={{ scale: 1.05 }}
          >
            <span>Made with</span>
            <Heart className="w-4 h-4 text-toon-pink fill-toon-pink" />
            <span>by Lovable AI</span>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
