
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Heart, MessageCircle, Share } from 'lucide-react';
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
  const navigate = useNavigate();

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
    toast.info('Comments coming soon');
  };

  const handleShare = (postId: string) => {
    toast.success('Post shared');
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
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
                <div className="p-3 flex items-center">
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
                
                {/* Post Content */}
                <div className="relative">
                  <img 
                    src={post.imageUrl} 
                    alt="" 
                    className="w-full aspect-square object-cover"
                  />
                  {post.type !== 'post' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-black/30 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-white fill-white ml-1" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Post Actions */}
                <div className="p-3 flex items-center gap-4">
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
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No content found</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Index;
