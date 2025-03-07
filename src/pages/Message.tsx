
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { MessageCircle, Search, UserRound } from 'lucide-react';
import { Input } from "@/components/ui/input";

const Message = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample stories data - in a real app, this would come from an API
  const stories = [
    { id: 1, name: 'Alex Johnson', hasStory: true },
    { id: 2, name: 'Maria Garcia', hasStory: true },
    { id: 3, name: 'Tyler Wilson', hasStory: false },
    { id: 4, name: 'Emma Thompson', hasStory: true },
    { id: 5, name: 'Carlos Rodriguez', hasStory: true },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-8"
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
            Messages
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-toon-blue to-toon-purple bg-clip-text text-transparent">
            Your Conversations
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Connect with other creators and share your transformations.
          </p>
        </motion.div>
        
        {/* Stories section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 px-2">
              {stories.map((story) => (
                <motion.div 
                  key={story.id}
                  className="flex flex-col items-center"
                  whileHover={{ y: -2 }}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer mb-1 ${story.hasStory ? 'ring-2 ring-toon-blue p-0.5' : ''}`}>
                    <div className="bg-toon-blue/10 rounded-full w-full h-full flex items-center justify-center">
                      <UserRound className="w-8 h-8 text-toon-blue" />
                    </div>
                  </div>
                  <p className="text-xs text-center truncate w-20">{story.name}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Search component */}
        <motion.div 
          className="relative mb-8 max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search messages..."
              className="pl-9 bg-gray-50 border-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>
        
        <div className="flex flex-col items-center justify-center py-6">
          <MessageCircle className="w-24 h-24 text-toon-blue/20 mb-6" />
          <p className="text-xl text-gray-400">No messages yet</p>
          <p className="text-gray-400 mt-2">Your conversations will appear here</p>
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Message;
