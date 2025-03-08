
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { MessageCircle, Search, UserRound, SendHorizontal } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  // Sample followers and following data
  const followers = [
    { id: 1, name: 'Alex Johnson', avatar: null, lastMessage: 'Hey, how are you?' },
    { id: 2, name: 'Maria Garcia', avatar: null, lastMessage: 'Did you see my transform?' },
    { id: 3, name: 'Tyler Wilson', avatar: null, lastMessage: 'Cool project!' },
  ];

  const following = [
    { id: 4, name: 'Emma Thompson', avatar: null, lastMessage: 'Thanks for the follow!' },
    { id: 5, name: 'Carlos Rodriguez', avatar: null, lastMessage: 'Let me know what you think' },
  ];

  const filteredFollowers = followers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredFollowing = following.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          className="relative mb-6 max-w-md mx-auto"
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
        
        {/* User lists with tabs */}
        <motion.div
          className="max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Tabs defaultValue="following" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="followers">Followers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="following" className="space-y-2">
              {filteredFollowing.length > 0 ? (
                filteredFollowing.map(user => (
                  <motion.div 
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ y: -2 }}
                  >
                    <Avatar className="h-12 w-12 border border-gray-100">
                      <AvatarFallback className="bg-toon-blue/10">
                        <UserRound className="h-6 w-6 text-toon-blue" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="text-toon-blue">
                      <SendHorizontal className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No matching users found</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="followers" className="space-y-2">
              {filteredFollowers.length > 0 ? (
                filteredFollowers.map(user => (
                  <motion.div 
                    key={user.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    whileHover={{ y: -2 }}
                  >
                    <Avatar className="h-12 w-12 border border-gray-100">
                      <AvatarFallback className="bg-toon-blue/10">
                        <UserRound className="h-6 w-6 text-toon-blue" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                    </div>
                    <Button size="icon" variant="ghost" className="text-toon-blue">
                      <SendHorizontal className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No matching users found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Message;
