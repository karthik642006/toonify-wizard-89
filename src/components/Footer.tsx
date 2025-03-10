
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="py-8 px-6 mt-12 mb-24" // Added mb-24 to accommodate bottom navigation
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="container max-w-6xl mx-auto">
        <div className="flex justify-center items-center">
          <motion.div 
            className="flex items-center gap-1.5 text-sm text-gray-600"
            whileHover={{ scale: 1.05 }}
          >
            {/* Removed "Made with love by Lovable AI" text */}
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
