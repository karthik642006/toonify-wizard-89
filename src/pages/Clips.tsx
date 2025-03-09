
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Film, Heart, Share, MessageCircle, MoreVertical, ArrowUp, ArrowDown, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Sample clip data - in a real app, this would come from an API
const mockClips = [
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    username: 'creativecreator',
    profileImage: 'https://i.pravatar.cc/150?img=32',
    description: 'Neon lights in the city #neon #cityvibes',
    likes: 1204,
    comments: 85,
    isLiked: false,
    followers: 2345
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    username: 'naturelover',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    description: 'Spring has finally arrived! #nature #spring',
    likes: 3421,
    comments: 129,
    isLiked: false,
    followers: 5678
  },
  {
    id: '3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    username: 'oceanview',
    profileImage: 'https://i.pravatar.cc/150?img=39',
    description: 'Peaceful waves on a sunny day #ocean #relax',
    likes: 5672,
    comments: 231,
    isLiked: false,
    followers: 8932
  }
];

const Clips = () => {
  const [clips, setClips] = useState(mockClips);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const { toast } = useToast();

  // Handle swipe up to next clip
  const handleSwipeUp = () => {
    if (currentClipIndex < clips.length - 1) {
      // Pause current video
      if (videoRefs.current[currentClipIndex]) {
        videoRefs.current[currentClipIndex]?.pause();
      }
      setCurrentClipIndex(prev => prev + 1);
    }
  };

  // Handle swipe down to previous clip
  const handleSwipeDown = () => {
    if (currentClipIndex > 0) {
      // Pause current video
      if (videoRefs.current[currentClipIndex]) {
        videoRefs.current[currentClipIndex]?.pause();
      }
      setCurrentClipIndex(prev => prev - 1);
    }
  };

  // Play the current clip
  useEffect(() => {
    const videoElement = videoRefs.current[currentClipIndex];
    if (videoElement) {
      videoElement.currentTime = 0;
      videoElement.play().catch(error => {
        console.error("Error playing video:", error);
      });
    }

    return () => {
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [currentClipIndex]);

  // Like functionality
  const handleLike = (clipId: string) => {
    setClips(prevClips => prevClips.map(clip => {
      if (clip.id === clipId) {
        return {
          ...clip,
          likes: clip.isLiked ? clip.likes - 1 : clip.likes + 1,
          isLiked: !clip.isLiked
        };
      }
      return clip;
    }));
  };

  // Show comment dialog
  const handleCommentClick = () => {
    setIsCommentOpen(true);
  };

  // Share functionality
  const handleShare = () => {
    setShareDialogOpen(true);
  };

  // More options functionality
  const handleMoreOptions = () => {
    toast({
      title: "More options",
      description: "This feature will be available soon!",
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="h-[calc(100vh-120px)] pt-16 relative overflow-hidden">
        {clips.length > 0 ? (
          <motion.div 
            className="h-full w-full relative overflow-hidden"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(event, info) => {
              if (info.offset.y < -50) {
                handleSwipeUp();
              } else if (info.offset.y > 50) {
                handleSwipeDown();
              }
            }}
          >
            {clips.map((clip, index) => (
              <div 
                key={clip.id}
                className={`absolute top-0 left-0 w-full h-full ${index === currentClipIndex ? 'z-10' : 'z-0 pointer-events-none'}`}
              >
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={clip.videoUrl}
                  className="object-cover h-full w-full"
                  loop
                  muted
                  playsInline
                  onClick={e => {
                    if (e.currentTarget.paused) {
                      e.currentTarget.play();
                    } else {
                      e.currentTarget.pause();
                    }
                  }}
                />
                
                {/* Creator Profile - Bottom Left */}
                <div className="absolute left-4 bottom-24 flex items-center z-20">
                  <Avatar className="h-12 w-12 border-2 border-white">
                    <AvatarImage src={clip.profileImage} alt={clip.username} />
                    <AvatarFallback>{clip.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3 text-white">
                    <h3 className="font-bold text-base">@{clip.username}</h3>
                    <p className="text-xs opacity-90">{clip.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                
                {/* Clip Description */}
                <div className="absolute bottom-16 left-4 right-16 text-white z-20 mt-2">
                  <p className="text-sm opacity-90">{clip.description}</p>
                </div>
                
                {/* Action Buttons (Right Side) */}
                <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-20">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                    onClick={() => handleLike(clip.id)}
                  >
                    <Heart className={`w-6 h-6 ${clip.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-xs font-medium absolute -bottom-6">{clip.likes}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                    onClick={handleCommentClick}
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs font-medium absolute -bottom-6">{clip.comments}</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                    onClick={handleShare}
                  >
                    <Share className="w-6 h-6" />
                    <span className="text-xs font-medium absolute -bottom-6">Share</span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                    onClick={handleMoreOptions}
                  >
                    <MoreVertical className="w-6 h-6" />
                  </Button>
                </div>
                
                {/* Swipe indicators */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-6 items-center text-white/70 z-20">
                  {currentClipIndex > 0 && (
                    <div className="flex flex-col items-center">
                      <ArrowUp className="w-6 h-6 animate-bounce" />
                      <span className="text-xs">Prev</span>
                    </div>
                  )}
                  {currentClipIndex < clips.length - 1 && (
                    <div className="flex flex-col items-center mt-4">
                      <ArrowDown className="w-6 h-6 animate-bounce" />
                      <span className="text-xs">Next</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Film className="w-24 h-24 text-toon-blue/20 mb-6" />
            <p className="text-xl text-gray-400">No clips available</p>
            <p className="text-gray-400 mt-2">Check back later for new content</p>
          </div>
        )}
      </main>

      {/* Comments Dialog */}
      <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Comments</h2>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-medium text-sm">User{i + 1}</p>
                    <p className="text-sm text-gray-600">This is an awesome clip! Love the content.</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border rounded-full px-4 py-1 text-sm"
              />
              <Button size="sm">Post</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-xs">
          <h2 className="text-lg font-bold mb-4">Share this clip</h2>
          <div className="grid grid-cols-4 gap-4">
            {['Instagram', 'Twitter', 'Facebook', 'WhatsApp', 'TikTok', 'Email', 'Copy Link', 'More'].map((platform) => (
              <div 
                key={platform} 
                className="flex flex-col items-center"
                onClick={() => {
                  toast({
                    title: "Shared!",
                    description: `Clip shared to ${platform}`,
                  });
                  setShareDialogOpen(false);
                }}
              >
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mb-1">
                  {platform.charAt(0)}
                </div>
                <span className="text-xs">{platform}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Clips;
