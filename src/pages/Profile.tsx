
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { UserRound, Settings, Heart, Star, LogOut, Pencil, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FollowType = 'followers' | 'following';

const Profile = () => {
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [followType, setFollowType] = useState<FollowType>('followers');
  
  const profileItems = [
    { icon: Settings, label: 'Settings', action: () => toast.info('Settings clicked') },
    { icon: Heart, label: 'Favorites', action: () => toast.info('Favorites clicked') },
    { icon: Star, label: 'Premium', action: () => toast.info('Premium clicked') },
    { icon: LogOut, label: 'Log out', action: () => toast.info('Log out clicked') },
  ];

  const followers = [
    { id: 1, name: 'Alex Johnson', avatar: null },
    { id: 2, name: 'Maria Garcia', avatar: null },
    { id: 3, name: 'Tyler Wilson', avatar: null },
  ];

  const following = [
    { id: 4, name: 'Emma Thompson', avatar: null },
    { id: 5, name: 'Carlos Rodriguez', avatar: null },
  ];

  const handleShowFollowers = () => {
    setFollowType('followers');
    setShowFollowDialog(true);
  };

  const handleShowFollowing = () => {
    setFollowType('following');
    setShowFollowDialog(true);
  };

  const handleEditProfile = () => {
    toast.info('Edit profile functionality coming soon');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-24 px-6 mx-auto">
        <motion.div 
          className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-toon-blue/10 flex items-center justify-center mb-6">
              <UserRound className="w-16 h-16 text-toon-blue" />
            </div>
            <motion.button
              className="absolute bottom-6 right-0 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
              onClick={handleEditProfile}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Pencil className="w-4 h-4 text-toon-blue" />
            </motion.button>
          </div>
          
          <h1 className="text-2xl font-bold mb-1">John Doe</h1>
          <p className="text-gray-500 mb-6">user@example.com</p>
          
          <div className="flex justify-center w-full gap-12 mb-8">
            <motion.button
              className="flex flex-col items-center"
              onClick={handleShowFollowing}
              whileHover={{ y: -2 }}
            >
              <p className="text-2xl font-bold text-toon-blue">{following.length}</p>
              <p className="text-sm text-gray-500">Following</p>
            </motion.button>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-toon-blue">42</p>
              <p className="text-sm text-gray-500">Transforms</p>
            </div>
            
            <motion.button
              className="flex flex-col items-center"
              onClick={handleShowFollowers}
              whileHover={{ y: -2 }}
            >
              <p className="text-2xl font-bold text-toon-blue">{followers.length}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </motion.button>
          </div>
        </motion.div>
        
        <div className="max-w-md mx-auto">
          {profileItems.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer mb-2"
              onClick={item.action}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <div className="p-2 rounded-full bg-toon-blue/10">
                <item.icon className="w-5 h-5 text-toon-blue" />
              </div>
              <span className="font-medium">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </main>
      
      <Dialog open={showFollowDialog} onOpenChange={setShowFollowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{followType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {(followType === 'followers' ? followers : following).map(user => (
              <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-toon-blue/10 flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-toon-blue" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{user.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    followType === 'followers' ? "border-toon-blue text-toon-blue" : "bg-toon-blue text-white"
                  )}
                  onClick={() => toast.info(followType === 'followers' ? 'Follow back' : 'Unfollow')}
                >
                  {followType === 'followers' ? 'Follow' : 'Following'}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Profile;
