import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Search, Bell, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Searching for: ${searchQuery}`);
      // Here you would typically handle the search functionality
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  // Sample notifications - in a real app, these would come from an API
  const notifications = [
    { id: 1, text: 'Your image has been transformed!', time: '2 min ago', read: false },
    { id: 2, text: 'John liked your cartoon avatar', time: '1 hour ago', read: false },
    { id: 3, text: 'New style available: Anime', time: '3 hours ago', read: true },
    { id: 4, text: 'Your weekly summary is ready', time: '1 day ago', read: true }
  ];

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        {/* App name in center */}
        <div className="flex-1"></div>
        
        <div className="text-lg font-bold">CartoonApp</div>
        
        {/* Profile icon and actions on the right */}
        <motion.div 
          className="flex items-center gap-2 flex-1 justify-end"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <button 
            className="p-2 rounded-full hover:bg-gray-100/50 transition-colors"
            onClick={() => setShowSearch(true)}
          >
            <Search className="w-5 h-5" />
          </button>
          <button 
            className="p-2 rounded-full hover:bg-gray-100/50 transition-colors relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          <button 
            onClick={handleProfileClick} 
            className="p-2 rounded-full hover:bg-gray-100/50 transition-colors"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={user?.profilePicture} alt={user?.name || "Profile"} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </button>
        </motion.div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSearch(false)}
          >
            <motion.div 
              className="bg-white rounded-lg w-full max-w-md p-4 shadow-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Search</h3>
                <button 
                  onClick={() => setShowSearch(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-toon-blue"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  Try searching for cartoons, styles, or creators
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            className="absolute right-4 top-16 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50 border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="p-3 border-b">
              <h3 className="font-semibold">Notifications</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm">{notification.text}</p>
                      {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No notifications</div>
              )}
            </div>
            <div className="p-3 border-t text-center">
              <button className="text-sm text-toon-blue hover:underline">Mark all as read</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
