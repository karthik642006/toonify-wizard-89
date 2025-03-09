
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Film, Heart, Share, MessageCircle, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Sample clip data with added creator info
const mockClips = [
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    username: 'creativecreator',
    userAvatar: null, // null for default avatar
    description: 'Neon lights in the city #neon #cityvibes',
    likes: 1204,
    comments: 85,
    isLiked: false
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    username: 'naturelover',
    userAvatar: '/placeholder.svg', // User avatar from public folder
    description: 'Spring has finally arrived! #nature #spring',
    likes: 3421,
    comments: 129,
    isLiked: false
  },
  {
    id: '3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    username: 'oceanview',
    userAvatar: null,
    description: 'Peaceful waves on a sunny day #ocean #relax',
    likes: 5672,
    comments: 231,
    isLiked: false
  }
];

const Clips = () => {
  const [clips, setClips] = useState(mockClips);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
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

  // Handle touch events for swiping
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      // Detect swipe direction with a threshold of 50px
      if (diff > 50) {
        handleSwipeUp(); // Swipe up
      } else if (diff < -50) {
        handleSwipeDown(); // Swipe down
      }
    };
    
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentClipIndex]);

  // Play the current clip
  useEffect(() => {
    const videoElement = videoRefs.current[currentClipIndex];
    if (videoElement && isAutoplay) {
      videoElement.currentTime = 0;
      const playPromise = videoElement.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing video:", error);
          // Set autoplay to false if browser blocks autoplay
          setIsAutoplay(false);
        });
      }
    }

    return () => {
      if (videoElement) {
        videoElement.pause();
      }
    };
  }, [currentClipIndex, isAutoplay]);

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

  // Toggle play/pause on video click
  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>, index: number) => {
    const video = e.currentTarget;
    if (index === currentClipIndex) {
      if (video.paused) {
        video.play().catch(err => console.error("Error playing video:", err));
      } else {
        video.pause();
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="h-[calc(100vh-120px)] pt-16 relative overflow-hidden">
        {clips.length > 0 ? (
          <div 
            ref={containerRef}
            className="h-full w-full relative overflow-hidden"
          >
            {clips.map((clip, index) => (
              <motion.div 
                key={clip.id}
                className={`absolute top-0 left-0 w-full h-full ${index === currentClipIndex ? 'z-10' : 'z-0 pointer-events-none'}`}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(event, info) => {
                  if (info.offset.y < -50) {
                    handleSwipeUp();
                  } else if (info.offset.y > 50) {
                    handleSwipeDown();
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentClipIndex ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <video
                  ref={el => videoRefs.current[index] = el}
                  src={clip.videoUrl}
                  className="object-cover h-full w-full"
                  loop
                  muted
                  playsInline
                  onClick={(e) => handleVideoClick(e, index)}
                />
                
                {/* Clip Info */}
                <div className="absolute bottom-20 left-4 right-16 text-white z-20">
                  {/* User avatar and name */}
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-10 w-10 border-2 border-white">
                      {clip.userAvatar ? (
                        <AvatarImage src={clip.userAvatar} alt={clip.username} />
                      ) : (
                        <AvatarFallback className="bg-toon-blue text-white">
                          {clip.username.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h3 className="font-bold text-lg">@{clip.username}</h3>
                  </div>
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
                
                {/* Swipe indicator */}
                {index === currentClipIndex && (
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/50 text-xs font-medium"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 2, duration: 1 }}
                  >
                    Swipe {index < clips.length - 1 ? 'up' : 'down'} for {index < clips.length - 1 ? 'next' : 'previous'} clip
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
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
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto" aria-describedby="comment-dialog-description">
          <div className="space-y-4" id="comment-dialog-description">
            <h2 className="text-xl font-bold">Comments</h2>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-toon-blue/10 text-toon-blue text-xs">
                      U{i+1}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">User{i + 1}</p>
                    <p className="text-sm text-gray-600">This is an awesome clip! Love the content.</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-toon-blue/10 text-toon-blue text-xs">
                  ME
                </AvatarFallback>
              </Avatar>
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
        <DialogContent className="max-w-xs" aria-describedby="share-dialog-description">
          <h2 className="text-lg font-bold mb-4">Share this clip</h2>
          <div className="grid grid-cols-4 gap-4" id="share-dialog-description">
            {['Instagram', 'Twitter', 'Facebook', 'WhatsApp', 'TikTok', 'Email', 'Copy Link', 'More'].map((platform) => (
              <div 
                key={platform} 
                className="flex flex-col items-center cursor-pointer"
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
