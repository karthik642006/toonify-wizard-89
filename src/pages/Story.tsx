
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, X, Send, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
  const { user, followUser, unfollowUser, isFollowing } = useAuth();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [stories, setStories] = useState<Array<{
    id: string;
    username: string;
    imageUrl: string;
    videoUrl: string | null;
    timestamp: string;
    profilePicture?: string;
  }>>(mockStories);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Load user stories from localStorage
  useEffect(() => {
    try {
      // First load user content that can be shown as stories
      const userContent = JSON.parse(localStorage.getItem('userContent') || '[]');
      const userStories = JSON.parse(localStorage.getItem('userStories') || '[]');
      
      const combinedStories = [...userStories];
      
      // Add posts/clips/videos as stories
      userContent.forEach((content: any) => {
        // Check if it's already in stories
        if (!combinedStories.some((story: any) => story.id === content.id)) {
          combinedStories.push({
            id: content.id,
            username: content.userId || user?.username || 'johndoe',
            imageUrl: content.imageUrl || '',
            videoUrl: content.videoUrl || null,
            timestamp: content.createdAt ? new Date(content.createdAt).toLocaleString() : 'Just now',
            profilePicture: content.profileImage || user?.profilePicture
          });
        }
      });
      
      if (combinedStories.length > 0) {
        setStories(prev => [...combinedStories, ...mockStories]);
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
      setLiked(false);
    } else {
      handleClose();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setIsPlaying(false);
      setLiked(false);
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
    if (!videoRef.current) return;
    
    try {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error playing video:", error);
      toast.error("Could not play video");
    }
  };

  const handleFollow = () => {
    const currentStory = stories[currentStoryIndex];
    if (isFollowing(currentStory.username)) {
      unfollowUser(currentStory.username);
    } else {
      followUser(currentStory.username, currentStory.username, currentStory.profilePicture);
    }
  };

  const currentStory = stories[currentStoryIndex];
  const currentUserIsFollowed = currentStory ? isFollowing(currentStory.username) : false;

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
                  ref={videoRef}
                  src={currentStory.videoUrl} 
                  className="h-full w-full object-cover" 
                  onClick={handlePlayVideo}
                  onEnded={handleNextStory}
                  playsInline
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
                  src={currentStory?.profilePicture || `https://i.pravatar.cc/40?u=${currentStory?.username}`} 
                  alt={currentStory?.username} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-medium">@{currentStory?.username}</p>
                <p className="text-white/70 text-xs">{currentStory?.timestamp}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentStory && currentStory.username !== user?.username && (
                <button 
                  className={`px-3 py-1 rounded-full text-xs ${currentUserIsFollowed ? 'bg-white/20 text-white' : 'bg-white text-black'}`}
                  onClick={handleFollow}
                >
                  {currentUserIsFollowed ? 'Following' : 'Follow'}
                </button>
              )}
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
          <DialogDescription className="sr-only">Send a direct message</DialogDescription>
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
