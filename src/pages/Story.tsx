
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, X, Send, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';

// Mock stories data
const mockStories = [
  {
    id: '1',
    username: 'user1',
    imageUrl: 'https://i.pravatar.cc/300?img=1',
    videoUrl: null,
    timestamp: '2h ago',
  },
  {
    id: '2',
    username: 'user2',
    imageUrl: 'https://i.pravatar.cc/300?img=2',
    videoUrl: null,
    timestamp: '3h ago',
  },
  {
    id: '3',
    username: 'user3',
    imageUrl: 'https://i.pravatar.cc/300?img=3',
    videoUrl: null,
    timestamp: '5h ago',
  }
];

const Story = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [stories, setStories] = useState<Array<{
    id: string;
    username: string;
    imageUrl: string;
    videoUrl: string | null;
    timestamp: string;
  }>>(mockStories);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Load user stories from localStorage
  useEffect(() => {
    try {
      const userStories = JSON.parse(localStorage.getItem('userStories') || '[]');
      
      if (userStories.length > 0) {
        const formattedUserStories = userStories.map((story: any) => ({
          id: story.id,
          username: user?.username || 'johndoe',
          imageUrl: story.imageUrl,
          videoUrl: story.videoUrl || null,
          timestamp: story.timestamp || 'Just now'
        }));
        
        setStories(prev => [...formattedUserStories, ...prev]);
      }
    } catch (error) {
      console.error("Error loading user stories:", error);
    }
  }, [user]);
  
  // Find initial story index based on id
  useEffect(() => {
    const index = stories.findIndex(story => story.id === id);
    if (index !== -1) {
      setCurrentStoryIndex(index);
    }
  }, [id, stories]);

  const handleClose = () => {
    navigate('/message');
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setIsPlaying(false);
    } else {
      handleClose();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed like' : 'Story liked!');
  };

  const handleMessage = () => {
    setShowMessageDialog(true);
  };

  const handleSendDirectMessage = () => {
    if (messageText.trim()) {
      toast.success('Message sent!');
      setMessageText('');
      setShowMessageDialog(false);
    }
  };

  const handlePlayVideo = () => {
    const video = document.getElementById('story-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(err => {
          console.error("Error playing video:", err);
          toast.error("Could not play video");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentStory = stories[currentStoryIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <motion.div 
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x > 100) {
            handlePrevStory();
          } else if (info.offset.x < -100) {
            handleNextStory();
          }
        }}
      >
        {/* Close button */}
        <button 
          className="absolute top-4 right-4 z-50 p-2 text-white"
          onClick={handleClose}
        >
          <X />
        </button>

        {/* Story progress bar */}
        <div className="absolute top-2 left-0 right-0 flex gap-1 px-4 z-40">
          {stories.map((_, index) => (
            <div 
              key={index} 
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/30"
            >
              <div 
                className={`h-full bg-white ${index === currentStoryIndex ? 'animate-progress' : index < currentStoryIndex ? 'w-full' : 'w-0'}`}
                style={{animationDuration: '5s'}}
              />
            </div>
          ))}
        </div>

        {/* Story content */}
        <div className="h-full w-full flex flex-col">
          {currentStory && (
            currentStory.videoUrl ? (
              <div className="relative h-full w-full">
                <video 
                  id="story-video"
                  src={currentStory.videoUrl} 
                  className="h-full w-full object-cover" 
                  onClick={handlePlayVideo}
                  onEnded={handleNextStory}
                />
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center"
                      onClick={handlePlayVideo}
                    >
                      <Play className="h-8 w-8 text-white" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <img 
                src={currentStory.imageUrl} 
                alt="Story" 
                className="h-full w-full object-cover"
              />
            )
          )}
        </div>

        {/* Story info and actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img 
                  src={`https://i.pravatar.cc/40?u=${currentStory?.username}`} 
                  alt={currentStory?.username} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-medium">@{currentStory?.username}</p>
                <p className="text-white/70 text-xs">{currentStory?.timestamp}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                className="text-white p-2"
                onClick={handleLike}
              >
                <Heart className={liked ? "fill-red-500 text-red-500" : ""} />
              </button>
              <button 
                className="text-white p-2"
                onClick={handleMessage}
              >
                <MessageCircle />
              </button>
            </div>
          </div>
        </div>

        {/* Touch areas for navigation */}
        <button 
          className="absolute left-0 top-0 h-full w-1/3 z-20"
          onClick={handlePrevStory}
        />
        <button 
          className="absolute right-0 top-0 h-full w-1/3 z-20"
          onClick={handleNextStory}
        />
      </motion.div>

      {/* Direct Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Send message to {currentStory?.username}</DialogTitle>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border rounded-md px-3 py-2"
              />
              <Button 
                className="bg-toon-blue hover:bg-toon-blue/90"
                onClick={handleSendDirectMessage}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Story;
