
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Briefcase, GraduationCap, ShoppingBag, Store } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type JobCategory = 'internships' | 'jobs' | 'courses' | 'shop';

const Jobs = () => {
  const [activeCategory, setActiveCategory] = useState<JobCategory>('jobs');
  
  const categories = [
    { id: 'internships', label: 'Internships', icon: GraduationCap },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'courses', label: 'Courses', icon: GraduationCap },
    { id: 'shop', label: 'Shop', icon: Store },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-6"
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
            Transformation Jobs
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-toon-blue to-toon-purple bg-clip-text text-transparent">
            Your Processing Queue
          </h1>
          <p className="text-lg text-gray-600">
            Track the status of your transformation jobs and manage your queue.
          </p>
        </motion.div>
        
        {/* Category Tabs */}
        <div className="flex overflow-x-auto justify-center gap-2 md:gap-3 mb-8 pb-2">
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg whitespace-nowrap transition-colors",
                activeCategory === category.id 
                  ? "bg-toon-blue text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => setActiveCategory(category.id as JobCategory)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Content based on selected category */}
        <div className="flex flex-col items-center justify-center py-12">
          {activeCategory === 'jobs' && (
            <>
              <Briefcase className="w-16 h-16 text-toon-blue/20 mb-6" />
              <p className="text-xl text-gray-400">No active jobs</p>
              <p className="text-gray-400 mt-2">Your transformation jobs will appear here</p>
            </>
          )}
          
          {activeCategory === 'internships' && (
            <>
              <GraduationCap className="w-16 h-16 text-toon-blue/20 mb-6" />
              <p className="text-xl text-gray-400">No internships found</p>
              <p className="text-gray-400 mt-2">Available internships will appear here</p>
            </>
          )}
          
          {activeCategory === 'courses' && (
            <>
              <GraduationCap className="w-16 h-16 text-toon-blue/20 mb-6" />
              <p className="text-xl text-gray-400">No courses available</p>
              <p className="text-gray-400 mt-2">Recommended courses will appear here</p>
            </>
          )}
          
          {activeCategory === 'shop' && (
            <>
              <ShoppingBag className="w-16 h-16 text-toon-blue/20 mb-6" />
              <p className="text-xl text-gray-400">Shop is empty</p>
              <p className="text-gray-400 mt-2">Products will appear here soon</p>
            </>
          )}
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Jobs;
