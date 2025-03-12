
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { Heart, Share, MessageCircle, MoreVertical, BookmarkPlus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

// Sample clip data - in a real app, this would come from an API
const mockClips = [
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    username: 'creativecreator',
    profileImage: 'https://i.pravatar.cc/150?img=32',
    likes: 1204,
    comments: 85,
    isLiked: false,
    followers: 2345,
    isFollowing: false
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    username: 'naturelover',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    likes: 3421,
    comments: 129,
    isLiked: false,
    followers: 5678,
    isFollowing: false
  },
  {
    id: '3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    username: 'oceanview',
    profileImage: 'https://i.pravatar.cc/150?img=39',
    likes: 5672,
    comments: 231,
    isLiked: false,
    followers: 8932,
    isFollowing: false
  }
];

const Clips = () => {
  const [clips, setClips] = useState(mockClips);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{username: string, text: string}[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, followUser, unfollowUser, isFollowing } = useAuth();
  const navigate = useNavigate();

  // Try to load user content at initialization
  useEffect(() => {
    try {
      const userContent = JSON.parse(localStorage.getItem('userContent') || '[]');
      const userClips = userContent.filter((item: any) => item.type === 'clip' || item.videoUrl);
      
      if (userClips.length > 0) {
        // Format user clips to match mockClips structure
        const formattedUserClips = userClips.map((clip: any) => ({
          id: clip.id,
          videoUrl: clip.videoUrl || clip.imageUrl,
          username: clip.userId || user?.username || 'User',
          profileImage: clip.profileImage || user?.profilePicture || 'https://i.pravatar.cc/150?img=11',
          likes: clip.likes || 0,
          comments: clip.comments || 0,
          isLiked: false,
          followers: 2000,
          isFollowing: false
        }));
        
        // Combine user clips with mock clips
        setClips([...formattedUserClips, ...mockClips]);
      }
    } catch (error) {
      console.error("Error loading user clips:", error);
    }
  }, [user]);

  // Update isFollowing status based on auth context
  useEffect(() => {
    if (user) {
      setClips(prevClips => prevClips.map(clip => ({
        ...clip,
        isFollowing: isFollowing(clip.username)
      })));
    }
  }, [user, isFollowing]);

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
        // If browser blocks autoplay, show play button
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

  // Follow functionality
  const handleFollow = (clipId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const clip = clips.find(c => c.id === clipId);
    if (!clip) return;
    
    if (isFollowing(clip.username)) {
      unfollowUser(clip.username);
      
      setClips(prevClips => prevClips.map(c => {
        if (c.id === clipId) {
          return {
            ...c,
            isFollowing: false
          };
        }
        return c;
      }));
    } else {
      followUser(clip.username, clip.username, clip.profileImage);
      
      setClips(prevClips => prevClips.map(c => {
        if (c.id === clipId) {
          return {
            ...c,
            isFollowing: true
          };
        }
        return c;
      }));
    }
  };

  // Post comment
  const handlePostComment = () => {
    if (!commentText.trim()) return;
    
    setComments(prev => [...prev, {
      username: user?.username || 'You',
      text: commentText
    }]);
    
    setCommentText('');
    
    // Update comment count
    setClips(prevClips => prevClips.map((clip, i) => 
      i === currentClipIndex 
        ? {...clip, comments: clip.comments + 1} 
        : clip
    ));
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
    setMoreOptionsOpen(true);
  };

  // Navigate to uploader's profile
  const handleProfileClick = (username: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/profile/${username}`);
  };

  // Save clip
  const handleSave = () => {
    const currentClip = clips[currentClipIndex];
    
    try {
      // Get existing saved content
      const savedContent = JSON.parse(localStorage.getItem('savedContent') || '[]');
      
      // Check if already saved
      if (savedContent.some((item: any) => item.id === currentClip.id)) {
        toast.error("You've already saved this clip");
        return;
      }
      
      // Add to saved content
      savedContent.push(currentClip);
      localStorage.setItem('savedContent', JSON.stringify(savedContent));
      
      toast.success(`Saved clip from ${currentClip.username}`);
      setMoreOptionsOpen(false);
    } catch (error) {
      console.error("Error saving clip:", error);
      toast.error("Failed to save clip");
    }
  };

  // Handle upload click
  const handleUploadClick = () => {
    setUploadDialogOpen(true);
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Handle clip upload
  const handleClipUpload = () => {
    if (!selectedFile || !previewUrl) {
      toast.error("Please select a file first");
      return;
    }
    
    try {
      const newClip = {
        id: Date.now().toString(),
        videoUrl: previewUrl,
        username: user?.username || 'User',
        profileImage: user?.profilePicture || 'https://i.pravatar.cc/150?img=11',
        likes: 0,
        comments: 0,
        isLiked: false,
        followers: 0,
        isFollowing: false,
        type: 'clip',
        userId: user?.username || 'User',
        caption: caption,
        createdAt: new Date().toISOString()
      };
      
      // Add to clips list
      setClips(prevClips => [newClip, ...prevClips]);
      
      // Add to user content in localStorage
      const userContent = JSON.parse(localStorage.getItem('userContent') || '[]');
      userContent.unshift({
        id: newClip.id,
        videoUrl: previewUrl,
        type: 'clip',
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0,
        userId: user?.username || 'User',
        username: user?.name || user?.username || 'User',
        profileImage: user?.profilePicture || 'https://i.pravatar.cc/150?img=11',
        caption: caption
      });
      localStorage.setItem('userContent', JSON.stringify(userContent));
      
      toast.success("Clip uploaded successfully!");
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption('');
      setUploadDialogOpen(false);
    } catch (error) {
      console.error("Error uploading clip:", error);
      toast.error("Failed to upload clip");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="h-screen relative overflow-hidden">
        {/* Upload button */}
        <div className="absolute top-4 right-4 z-50">
          <Button 
            onClick={handleUploadClick}
            className="bg-toon-blue hover:bg-toon-blue/90 rounded-full p-3"
          >
            <Upload className="h-5 w-5" />
          </Button>
        </div>
        
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
                <div className="absolute left-4 bottom-24 flex flex-col z-20">
                  <Avatar 
                    className="h-12 w-12 border-2 border-white cursor-pointer mb-2"
                    onClick={(e) => handleProfileClick(clip.username, e)}
                  >
                    <AvatarImage src={clip.profileImage} alt={clip.username} />
                    <AvatarFallback>{clip.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm font-medium mb-2">@{clip.username}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`py-0 px-3 h-7 text-xs rounded-full ${
                      clip.isFollowing 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'bg-white text-black border-none'
                    }`}
                    onClick={(e) => handleFollow(clip.id, e)}
                  >
                    {clip.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <div className="mt-1 text-white/80 text-xs">
                    {clip.followers.toLocaleString()} followers
                  </div>
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
              </div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-white">No clips available</p>
          </div>
        )}
      </main>

      {/* Comments Dialog */}
      <Dialog open={isCommentOpen} onOpenChange={setIsCommentOpen}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogTitle>Comments</DialogTitle>
          <DialogDescription className="sr-only">Add or view comments</DialogDescription>
          <div className="space-y-4">
            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div>
                      <p className="font-medium text-sm">{comment.username}</p>
                      <p className="text-sm text-gray-600">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">No comments yet. Be the first!</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <div className="w-8 h-8 rounded-full bg-gray-200"></div>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 border rounded-full px-4 py-1 text-sm"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
              />
              <Button size="sm" onClick={handlePostComment}>Post</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="max-w-xs">
          <DialogTitle>Share</DialogTitle>
          <DialogDescription className="sr-only">Share this content</DialogDescription>
          <div className="grid grid-cols-4 gap-4">
            {['Instagram', 'Twitter', 'Facebook', 'WhatsApp', 'TikTok', 'Email', 'Copy Link', 'More'].map((platform) => (
              <div 
                key={platform} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  toast.success(`Shared to ${platform}`);
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

      {/* More Options Dialog */}
      <Dialog open={moreOptionsOpen} onOpenChange={setMoreOptionsOpen}>
        <DialogContent className="max-w-xs">
          <DialogTitle>Options</DialogTitle>
          <DialogDescription className="sr-only">More options for this content</DialogDescription>
          <div className="flex flex-col gap-2">
            <Button 
              variant="ghost"
              className="justify-start"
              onClick={handleSave}
            >
              <BookmarkPlus className="mr-2 h-5 w-5" />
              Save
            </Button>
            {['Report', 'Not Interested', 'Remix', 'Cancel'].map((option) => (
              <Button 
                key={option} 
                variant={option === 'Cancel' ? 'outline' : 'ghost'}
                className="justify-start"
                onClick={() => {
                  if (option !== 'Cancel') {
                    toast.success(`${option} action selected`);
                  }
                  setMoreOptionsOpen(false);
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle>Upload Clip</DialogTitle>
          <DialogDescription>Share a new clip with your followers</DialogDescription>
          <div className="space-y-4">
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <video 
                  src={previewUrl} 
                  className="w-full h-full object-cover" 
                  controls
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to select a video file</p>
                <input 
                  type="file" 
                  accept="video/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="caption" className="block text-sm font-medium mb-1">Caption</label>
              <textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full p-2 border rounded-md resize-none h-20"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setCaption('');
                  setUploadDialogOpen(false);
                }}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleClipUpload}
                disabled={!selectedFile}
                className="bg-toon-blue hover:bg-toon-blue/90"
              >
                Upload
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <BottomNavigation />
    </div>
  );
};

export default Clips;
