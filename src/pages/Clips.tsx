
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Film } from 'lucide-react';

const Clips = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block px-3 py-1 mb-4 rounded-full bg-toon-blue/10 text-toon-blue text-xs font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Transformed Clips
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-toon-blue to-toon-purple bg-clip-text text-transparent">
            Your Creative Collection
          </h1>
          <p className="text-lg text-gray-600">
            Browse, manage, and share your transformed images all in one place.
          </p>
        </motion.div>
        
        <div className="flex flex-col items-center justify-center py-12">
          <Film className="w-24 h-24 text-toon-blue/20 mb-6" />
          <p className="text-xl text-gray-400">Your clips will appear here</p>
          <p className="text-gray-400 mt-2">Transform some photos to fill your collection</p>
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Clips;
