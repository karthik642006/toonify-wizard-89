
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Briefcase, GraduationCap, Library, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type JobCategory = 'internships' | 'jobs' | 'courses' | 'shop';

const Jobs = () => {
  const [activeCategory, setActiveCategory] = useState<JobCategory>('jobs');
  
  const categories = [
    { id: 'internships', label: 'Internships', icon: GraduationCap },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'courses', label: 'Courses', icon: Library },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            &nbsp;
          </motion.div>
        </motion.div>
        
        {/* Category Tabs - Reduced size to match home page */}
        <div className="flex overflow-x-auto justify-center gap-2 mb-6 pb-2">
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
              <category.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Content based on selected category */}
        <div className="flex flex-col items-center justify-center py-8">
          {activeCategory === 'jobs' && (
            <>
              <Briefcase className="w-16 h-16 text-toon-blue/20 mb-4" />
              <h3 className="font-medium text-lg">Professional Opportunities</h3>
              <p className="text-gray-500 text-center max-w-md mt-2">
                Browse the latest job openings and career opportunities.
              </p>
            </>
          )}
          
          {activeCategory === 'internships' && (
            <>
              <GraduationCap className="w-16 h-16 text-toon-blue/20 mb-4" />
              <h3 className="font-medium text-lg">Learning Opportunities</h3>
              <p className="text-gray-500 text-center max-w-md mt-2">
                Find internships to gain valuable work experience.
              </p>
            </>
          )}
          
          {activeCategory === 'courses' && (
            <>
              <Library className="w-16 h-16 text-toon-blue/20 mb-4" />
              <h3 className="font-medium text-lg">Educational Materials</h3>
              <p className="text-gray-500 text-center max-w-md mt-2">
                Discover courses to enhance your skills and knowledge.
              </p>
            </>
          )}
          
          {activeCategory === 'shop' && (
            <>
              <ShoppingBag className="w-16 h-16 text-toon-blue/20 mb-4" />
              <h3 className="font-medium text-lg">Marketplace</h3>
              <p className="text-gray-500 text-center max-w-md mt-2">
                Shop for professional tools, services, and resources.
              </p>
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
