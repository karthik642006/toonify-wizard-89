
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Settings as SettingsIcon, Heart, Star, LogOut, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  
  const settingsItems = [
    { icon: Heart, label: 'Favorites', action: () => toast.info('Favorites clicked') },
    { icon: Star, label: 'Premium', action: () => toast.info('Premium clicked') },
    { icon: Users, label: 'Create Group', action: () => toast.info('Create Group functionality coming soon') },
    { icon: LogOut, label: 'Log out', action: () => toast.info('Log out clicked') },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-24 px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="w-6 h-6 text-toon-blue" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          
          <div className="max-w-md mx-auto">
            {settingsItems.map((item, index) => (
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
            
            <motion.div
              className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer mb-2 mt-6"
              onClick={() => navigate('/profile')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <span className="font-medium text-gray-500">Back to Profile</span>
            </motion.div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Settings;
