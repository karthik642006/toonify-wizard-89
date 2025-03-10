
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Plus, Camera, Search, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ImageUploader from '../components/ImageUploader';

// Mock stories data
const mockStories = [
  { id: '1', name: 'user1', image: 'https://i.pravatar.cc/150?img=1', hasStory: true, isViewed: false },
  { id: '2', name: 'user2', image: 'https://i.pravatar.cc/150?img=2', hasStory: true, isViewed: true },
  { id: '3', name: 'user3', image: 'https://i.pravatar.cc/150?img=3', hasStory: true, isViewed: false },
  { id: '4', name: 'user4', image: 'https://i.pravatar.cc/150?img=4', hasStory: true, isViewed: false },
  { id: '5', name: 'user5', image: 'https://i.pravatar.cc/150?img=5', hasStory: false, isViewed: false },
];

// Mock chat messages data
const mockChats = [
  { 
    id: '1', 
    name: 'Jane Smith', 
    image: 'https://i.pravatar.cc/150?img=1', 
    lastMessage: 'Hey, how are you doing?', 
    time: '2m', 
    unread: 3,
    isOnline: true 
  },
  { 
    id: '2', 
    name: 'Alex Johnson', 
    image: 'https://i.pravatar.cc/150?img=2', 
    lastMessage: 'Check out my new post!', 
    time: '15m', 
    unread: 0,
    isOnline: true 
  },
  { 
    id: '3', 
    name: 'Sam Williams', 
    image: 'https://i.pravatar.cc/150?img=3', 
    lastMessage: 'Let\'s catch up tomorrow?', 
    time: '1h', 
    unread: 1,
    isOnline: false 
  },
  { 
    id: '4', 
    name: 'Taylor Rodriguez', 
    image: 'https://i.pravatar.cc/150?img=4', 
    lastMessage: 'Thanks for the help!', 
    time: '3h', 
    unread: 0,
    isOnline: false 
  },
  { 
    id: '5', 
    name: 'Jordan Lee', 
    image: 'https://i.pravatar.cc/150?img=5', 
    lastMessage: 'Did you see the notification?', 
    time: '1d', 
    unread: 0,
    isOnline: true 
  },
];

const Message = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chats');
  const [showStoryUploadDialog, setShowStoryUploadDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const [myStories, setMyStories] = useState<{id: string, image: string}[]>([]);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [selectedChat, setSelectedChat] = useState<typeof mockChats[0] | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<{text: string, sender: 'user' | 'other', timestamp: string}[]>([]);

  const handleStoryClick = (id: string) => {
    // If it's the user's own story, open upload dialog
    if (id === 'my-story') {
      setShowStoryUploadDialog(true);
    } else {
      navigate(`/story/${id}`);
    }
  };

  const handleChatClick = (id: string) => {
    const chat = mockChats.find(c => c.id === id);
    if (chat) {
      setSelectedChat(chat);
      setShowMessageDialog(true);
      // Initialize with some mock messages
      setMessages([
        {text: 'Hey there!', sender: 'other', timestamp: '10:30 AM'},
        {text: 'How are you?', sender: 'user', timestamp: '10:31 AM'},
        {text: 'I\'m doing great, thanks for asking!', sender: 'other', timestamp: '10:32 AM'}
      ]);
    }
  };

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage({ file, preview });
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  const handleUploadStory = () => {
    if (selectedImage) {
      // Add the new story to myStories
      const newStory = {
        id: `my-story-${Date.now()}`,
        image: selectedImage.preview
      };
      
      setMyStories(prev => [newStory, ...prev]);
      toast.success('Story uploaded successfully!');
      setShowStoryUploadDialog(false);
      setSelectedImage(null);
    } else {
      toast.error('Please select an image');
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    setMessages(prev => [
      ...prev,
      {
        text: messageText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    ]);
    
    setMessageText('');
    
    // Simulate reply after 1 second
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text: 'Thanks for your message! I\'ll get back to you soon.',
          sender: 'other',
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        }
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-24 px-6 mx-auto">
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-6">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-toon-blue/50"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
        
        {/* Stories */}
        <div className="max-w-2xl mx-auto mb-6 overflow-x-auto">
          <div className="flex space-x-4 pb-2 px-1">
            {/* My Story (always first) */}
            <div className="flex flex-col items-center space-y-1">
              <button 
                className={`w-16 h-16 rounded-full ${myStories.length > 0 ? 'ring-2 ring-toon-blue' : 'bg-gray-100'} flex items-center justify-center relative`}
                onClick={() => handleStoryClick('my-story')}
              >
                {myStories.length > 0 ? (
                  <img src={myStories[0].image} alt="My Story" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-toon-blue rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-white" />
                </div>
              </button>
              <span className="text-xs">My Story</span>
            </div>
          
            {/* Other Stories */}
            {mockStories.map(story => (
              <div key={story.id} className="flex flex-col items-center space-y-1">
                <button 
                  className={`w-16 h-16 rounded-full overflow-hidden ${
                    story.hasStory && !story.isViewed 
                      ? 'ring-2 ring-toon-blue' 
                      : story.hasStory && story.isViewed 
                        ? 'ring-2 ring-gray-300' 
                        : ''
                  }`}
                  onClick={() => handleStoryClick(story.id)}
                >
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </button>
                <span className="text-xs">{story.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs for Chats/Requests */}
        <div className="max-w-2xl mx-auto">
          <Tabs defaultValue="chats" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="chats">Messages</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chats" className="space-y-4">
              {mockChats.map(chat => (
                <motion.div 
                  key={chat.id}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleChatClick(chat.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img src={chat.image} alt={chat.name} className="w-full h-full object-cover" />
                    </div>
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate max-w-[180px]">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <div className="ml-2 bg-toon-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>
            
            <TabsContent value="requests" className="p-4 text-center">
              <div className="py-6">
                <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No message requests</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Story Upload Dialog */}
      <Dialog open={showStoryUploadDialog} onOpenChange={setShowStoryUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Upload Story</h3>
            
            <ImageUploader 
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage?.preview || null}
              onClearImage={handleClearImage}
            />
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowStoryUploadDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-toon-blue hover:bg-toon-blue/90"
                onClick={handleUploadStory}
                disabled={!selectedImage}
              >
                Share to Story
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog} >
        <DialogContent className="sm:max-w-md max-h-[80vh]">
          <div className="flex flex-col h-[60vh]">
            {/* Chat header */}
            <div className="flex items-center p-3 border-b">
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={selectedChat?.image} alt={selectedChat?.name} className="w-full h-full object-cover" />
                </div>
                {selectedChat?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="font-medium">{selectedChat?.name}</h3>
                <p className="text-xs text-gray-500">{selectedChat?.isOnline ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            
            {/* Messages area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-toon-blue text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'} text-right mt-1`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message input */}
            <div className="border-t p-2 flex">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-grow border rounded-full px-4 py-2 text-sm mr-2"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button 
                className="rounded-full bg-toon-blue"
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Message;
