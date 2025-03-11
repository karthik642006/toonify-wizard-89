
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Play, Heart, MessageCircle, Share, MoreVertical, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Post } from '../models/post';

// Mock posts data from all users
const mockPosts: Post[] = [
  { 
    id: '1', 
    imageUrl: 'https://i.pravatar.cc/300?img=1', 
    type: 'post', 
    createdAt: '2023-05-01', 
    likes: 120, 
    comments: 14, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/150?img=11'
  },
  { 
    id: '9', 
    imageUrl: 'https://i.pravatar.cc/300?img=10', 
    type: 'post', 
    createdAt: '2023-05-01', 
    likes: 320, 
    comments: 28, 
    userId: 'creativecreator',
    username: 'Creative Creator',
    profileImage: 'https://i.pravatar.cc/150?img=32'
  },
  { 
    id: '12', 
    imageUrl: 'https://i.pravatar.cc/300?img=20', 
    type: 'post', 
    createdAt: '2023-05-01', 
    likes: 220, 
    comments: 18, 
    userId: 'naturelover',
    username: 'Nature Lover',
    profileImage: 'https://i.pravatar.cc/150?img=12'
  },
  { 
    id: '5', 
    imageUrl: 'https://i.pravatar.cc/300?img=5', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    type: 'video', 
    createdAt: '2023-05-05', 
    likes: 154, 
    comments: 19, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/150?img=11'
  },
  { 
    id: '10', 
    imageUrl: 'https://i.pravatar.cc/300?img=12', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    type: 'video', 
    createdAt: '2023-05-02', 
    likes: 520, 
    comments: 42, 
    userId: 'creativecreator',
    username: 'Creative Creator',
    profileImage: 'https://i.pravatar.cc/150?img=32'
  },
  { 
    id: '7', 
    imageUrl: 'https://i.pravatar.cc/300?img=7', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    type: 'clip', 
    createdAt: '2023-05-07', 
    likes: 231, 
    comments: 27, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/150?img=11'
  },
  { 
    id: '11', 
    imageUrl: 'https://i.pravatar.cc/300?img=14', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    type: 'clip', 
    createdAt: '2023-05-03', 
    likes: 720, 
    comments: 58, 
    userId: 'creativecreator',
    username: 'Creative Creator',
    profileImage: 'https://i.pravatar.cc/150?img=32'
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{username: string, text: string}[]>([]);
  const [isPlaying, setIsPlaying] = useState<{[key: string]: boolean}>({});
  const navigate = useNavigate();

  // Load user content
  useEffect(() => {
    try {
      const userContent = JSON.parse(localStorage.getItem('userContent') || '[]');
      if (userContent.length > 0) {
        setPosts(prev => [...userContent, ...prev]);
      }
    } catch (error) {
      console.error("Error loading user content:", error);
    }
  }, []);

  const handleLike = (postId: string) => {
    if (likedPosts.includes(postId)) {
      // Unlike
      setLikedPosts(prev => prev.filter(id => id !== postId));
      setPosts(prev => prev.map(post => 
        post.id === postId ? {...post, likes: post.likes - 1} : post
      ));
    } else {
      // Like
      setLikedPosts(prev => [...prev, postId]);
      setPosts(prev => prev.map(post => 
        post.id === postId ? {...post, likes: post.likes + 1} : post
      ));
    }
  };

  const handleComment = (postId: string) => {
    setSelectedPostId(postId);
    setCommentDialogOpen(true);
    // Get comments for this post (in a real app, you'd fetch these)
    setComments([]);
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    
    setComments(prev => [...prev, {
      username: 'You',
      text: commentText
    }]);
    
    setCommentText('');
    
    // Update comment count
    if (selectedPostId) {
      setPosts(prev => prev.map(post => 
        post.id === selectedPostId 
          ? {...post, comments: post.comments + 1} 
          : post
      ));
    }
  };

  const handleShare = (postId: string) => {
    setSelectedPostId(postId);
    setShareDialogOpen(true);
  };

  const handleMoreOptions = (postId: string) => {
    setSelectedPostId(postId);
    setMoreOptionsOpen(true);
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleVideoPlay = (postId: string) => {
    setIsPlaying(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    const videoElement = document.getElementById(`video-${postId}`) as HTMLVideoElement;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play().catch(error => {
          console.error("Error playing video:", error);
        });
      } else {
        videoElement.pause();
      }
    }
  };

  const handleSave = () => {
    toast.success("Post saved to your collections");
    setMoreOptionsOpen(false);
  };

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.type === activeTab.slice(0, -1)); // Convert 'posts' to 'post', 'videos' to 'video', etc.

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        {/* Content Tabs */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="clips">Clips</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Feed Content */}
        <div className="max-w-md mx-auto space-y-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <motion.div 
                key={post.id}
                className="bg-white rounded-lg shadow overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Post Header */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar 
                      className="h-10 w-10 cursor-pointer"
                      onClick={() => handleProfileClick(post.userId)}
                    >
                      <AvatarImage src={post.profileImage} alt={post.username} />
                      <AvatarFallback>{post.username?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium text-sm">{post.username}</p>
                      <p className="text-xs text-gray-500">{post.createdAt}</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleMoreOptions(post.id)}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Post Content */}
                <div 
                  className="relative"
                  onClick={() => post.type !== 'post' && handleVideoPlay(post.id)}
                >
                  {post.type === 'post' ? (
                    <img 
                      src={post.imageUrl} 
                      alt="" 
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <>
                      <video 
                        id={`video-${post.id}`}
                        src={post.videoUrl} 
                        poster={post.imageUrl}
                        className="w-full aspect-square object-cover"
                        loop
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                      />
                      {!isPlaying[post.id] && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white fill-white ml-1" />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Post Actions */}
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`w-6 h-6 ${likedPosts.includes(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>
                    
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleComment(post.id)}
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                    
                    <button 
                      className="flex items-center gap-1"
                      onClick={() => handleShare(post.id)}
                    >
                      <Share className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <button
                    onClick={() => handleSave()}
                  >
                    <BookmarkPlus className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No content found</p>
            </div>
          )}
        </div>
      </main>
      
      {/* Comments Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-y-auto">
          <DialogTitle>Comments</DialogTitle>
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
          <div className="grid grid-cols-4 gap-4">
            {['Instagram', 'Twitter', 'Facebook', 'WhatsApp', 'TikTok', 'Email', 'Copy Link', 'More'].map((platform) => (
              <div 
                key={platform} 
                className="flex flex-col items-center cursor-pointer"
                onClick={() => {
                  toast.success(`Shared to ${platform}!`);
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
          <div className="flex flex-col gap-2">
            <Button 
              variant="ghost"
              className="justify-start"
              onClick={handleSave}
            >
              <BookmarkPlus className="mr-2 h-5 w-5" />
              Save
            </Button>
            {['Report', 'Not Interested', 'Share', 'Cancel'].map((option) => (
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
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Index;
