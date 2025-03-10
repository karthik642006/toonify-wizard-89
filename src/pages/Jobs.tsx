
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
    { id: 'courses', label: 'Courses', icon: ShoppingBag },
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
            Jobs
          </motion.div>
        </motion.div>
        
        {/* Category Tabs - Reduced size to match home page */}
        <div className="flex overflow-x-auto justify-center gap-2 mb-6 pb-2">
          {categories.map(category => (
            <motion.button
              key={category.id}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg whitespace-nowrap transition-colors text-xs",
                activeCategory === category.id 
                  ? "bg-toon-blue text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              onClick={() => setActiveCategory(category.id as JobCategory)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <category.icon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Content based on selected category */}
        <div className="flex flex-col items-center justify-center py-8">
          {activeCategory === 'jobs' && (
            <>
              <Briefcase className="w-12 h-12 text-toon-blue/20 mb-4" />
            </>
          )}
          
          {activeCategory === 'internships' && (
            <>
              <GraduationCap className="w-12 h-12 text-toon-blue/20 mb-4" />
            </>
          )}
          
          {activeCategory === 'courses' && (
            <>
              <ShoppingBag className="w-12 h-12 text-toon-blue/20 mb-4" />
            </>
          )}
          
          {activeCategory === 'shop' && (
            <>
              <Store className="w-12 h-12 text-toon-blue/20 mb-4" />
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
