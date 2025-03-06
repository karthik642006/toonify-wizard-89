
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { UserRound, Settings, Heart, Star, LogOut } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const profileItems = [
    { icon: Settings, label: 'Settings', action: () => toast.info('Settings clicked') },
    { icon: Heart, label: 'Favorites', action: () => toast.info('Favorites clicked') },
    { icon: Star, label: 'Premium', action: () => toast.info('Premium clicked') },
    { icon: LogOut, label: 'Log out', action: () => toast.info('Log out clicked') },
  ];

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
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-toon-blue/10 flex items-center justify-center mb-4">
              <UserRound className="w-12 h-12 text-toon-blue" />
            </div>
            <h1 className="text-2xl font-bold mb-1">User Profile</h1>
            <p className="text-gray-500 mb-6">user@example.com</p>
            
            <div className="flex gap-4 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-toon-blue">42</p>
                <p className="text-xs text-gray-500">Transforms</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-toon-blue">12</p>
                <p className="text-xs text-gray-500">Favorites</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-toon-blue">7</p>
                <p className="text-xs text-gray-500">Shares</p>
              </div>
            </div>
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
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Profile;
