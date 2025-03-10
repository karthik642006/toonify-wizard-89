import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { UserRound, Settings, Share, Pencil, X, Check, Play } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ImageUploader from '../components/ImageUploader';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from '../models/post';

type FollowType = 'followers' | 'following';

// Mock user data
const mockUsers = [
  {
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'UI/UX Designer | Developer | Content Creator',
    profilePicture: 'https://i.pravatar.cc/300?img=11',
    followers: [
      { id: 1, name: 'Alex Johnson', avatar: null },
      { id: 2, name: 'Maria Garcia', avatar: null },
      { id: 3, name: 'Tyler Wilson', avatar: null },
    ],
    following: [
      { id: 4, name: 'Emma Thompson', avatar: null },
      { id: 5, name: 'Carlos Rodriguez', avatar: null },
    ],
  },
  {
    username: 'creativecreator',
    name: 'Creative Creator',
    email: 'creator@example.com',
    bio: 'Content creator & Visual artist',
    profilePicture: 'https://i.pravatar.cc/150?img=32',
    followers: [
      { id: 1, name: 'Fan One', avatar: null },
      { id: 2, name: 'Fan Two', avatar: null },
    ],
    following: [
      { id: 4, name: 'Artist One', avatar: null },
    ],
  },
  {
    username: 'naturelover',
    name: 'Nature Lover',
    email: 'nature@example.com',
    bio: 'Exploring nature & wildlife photography',
    profilePicture: 'https://i.pravatar.cc/150?img=12',
    followers: [
      { id: 1, name: 'Earth Lover', avatar: null },
      { id: 2, name: 'Planet Saver', avatar: null },
    ],
    following: [
      { id: 4, name: 'Wild Explorer', avatar: null },
    ],
  },
  {
    username: 'oceanview',
    name: 'Ocean View',
    email: 'ocean@example.com',
    bio: 'Ocean photographer & Marine life enthusiast',
    profilePicture: 'https://i.pravatar.cc/150?img=39',
    followers: [
      { id: 1, name: 'Sea Lover', avatar: null },
      { id: 2, name: 'Wave Rider', avatar: null },
    ],
    following: [
      { id: 4, name: 'Marine Biologist', avatar: null },
    ],
  }
];

// Mock posts data
const mockPosts: Post[] = [
  { id: '1', imageUrl: 'https://i.pravatar.cc/300?img=1', type: 'post', createdAt: '2023-05-01', likes: 120, comments: 14, userId: 'johndoe' },
  { id: '2', imageUrl: 'https://i.pravatar.cc/300?img=2', type: 'post', createdAt: '2023-05-02', likes: 85, comments: 7, userId: 'johndoe' },
  { id: '3', imageUrl: 'https://i.pravatar.cc/300?img=3', type: 'post', createdAt: '2023-05-03', likes: 210, comments: 23, userId: 'johndoe' },
  { id: '4', imageUrl: 'https://i.pravatar.cc/300?img=4', type: 'post', createdAt: '2023-05-04', likes: 97, comments: 9, userId: 'johndoe' },
  { id: '5', imageUrl: 'https://i.pravatar.cc/300?img=5', type: 'video', createdAt: '2023-05-05', likes: 154, comments: 19, userId: 'johndoe' },
  { id: '6', imageUrl: 'https://i.pravatar.cc/300?img=6', type: 'video', createdAt: '2023-05-06', likes: 176, comments: 21, userId: 'johndoe' },
  { id: '7', imageUrl: 'https://i.pravatar.cc/300?img=7', type: 'clip', createdAt: '2023-05-07', likes: 231, comments: 27, userId: 'johndoe' },
  { id: '8', imageUrl: 'https://i.pravatar.cc/300?img=8', type: 'clip', createdAt: '2023-05-08', likes: 189, comments: 16, userId: 'johndoe' },
  // Posts for creativecreator
  { id: '9', imageUrl: 'https://i.pravatar.cc/300?img=10', type: 'post', createdAt: '2023-05-01', likes: 320, comments: 28, userId: 'creativecreator' },
  { id: '10', imageUrl: 'https://i.pravatar.cc/300?img=12', type: 'video', createdAt: '2023-05-02', likes: 520, comments: 42, userId: 'creativecreator' },
  { id: '11', imageUrl: 'https://i.pravatar.cc/300?img=14', type: 'clip', createdAt: '2023-05-03', likes: 720, comments: 58, userId: 'creativecreator' },
  // Posts for naturelover
  { id: '12', imageUrl: 'https://i.pravatar.cc/300?img=20', type: 'post', createdAt: '2023-05-01', likes: 220, comments: 18, userId: 'naturelover' },
  { id: '13', imageUrl: 'https://i.pravatar.cc/300?img=22', type: 'video', createdAt: '2023-05-02', likes: 420, comments: 32, userId: 'naturelover' },
  // Posts for oceanview
  { id: '14', imageUrl: 'https://i.pravatar.cc/300?img=30', type: 'post', createdAt: '2023-05-01', likes: 250, comments: 20, userId: 'oceanview' },
  { id: '15', imageUrl: 'https://i.pravatar.cc/300?img=32', type: 'clip', createdAt: '2023-05-02', likes: 450, comments: 35, userId: 'oceanview' },
];

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [followType, setFollowType] = useState<FollowType>('followers');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileBio, setProfileBio] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  
  useEffect(() => {
    const targetUsername = username || 'johndoe';
    const user = mockUsers.find(u => u.username === targetUsername);
    
    if (user) {
      setUserProfile(user);
      setProfileName(user.name);
      setProfileEmail(user.email);
      setProfileBio(user.bio || '');
      setProfilePicture(user.profilePicture);
      
      const posts = mockPosts.filter(post => post.userId === user.username);
      
      try {
        const userContent = JSON.parse(localStorage.getItem('userContent') || '[]');
        const userSpecificContent = userContent.filter((item: Post) => 
          item.userId === user.username || (!username && item.userId === 'johndoe')
        );
        
        setUserPosts([...userSpecificContent, ...posts]);
      } catch (error) {
        console.error('Error loading user content:', error);
        setUserPosts(posts);
      }
      
      setIsOwnProfile(targetUsername === 'johndoe' || !username);
    }
  }, [username]);

  const handleShowFollowers = () => {
    setFollowType('followers');
    setShowFollowDialog(true);
  };

  const handleShowFollowing = () => {
    setFollowType('following');
    setShowFollowDialog(true);
  };

  const handleEditProfile = () => {
    setEditName(profileName);
    setEditEmail(profileEmail);
    setEditBio(profileBio);
    setShowEditDialog(true);
  };

  const handleEditProfilePicture = () => {
    setShowProfilePictureDialog(true);
  };

  const handleSaveProfile = () => {
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    if (!editEmail.trim() || !/\S+@\S+\.\S+/.test(editEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setProfileName(editName);
    setProfileEmail(editEmail);
    setProfileBio(editBio);
    setShowEditDialog(false);
    toast.success('Profile updated successfully');
  };

  const handleSaveProfilePicture = () => {
    if (selectedImage) {
      setProfilePicture(selectedImage);
      setShowProfilePictureDialog(false);
      toast.success('Profile picture updated successfully');
    } else {
      toast.error('Please select an image');
    }
  };

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(preview);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  const handleOpenSettings = () => {
    navigate('/settings');
  };

  const handleShareProfile = () => {
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl)
      .then(() => toast.success('Profile link copied to clipboard!'))
      .catch(err => toast.error('Could not copy the profile link'));
  };
  
  const getFilteredContent = (type: string) => {
    return userPosts.filter(post => post.type === type);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-24 px-6 mx-auto">
        {isOwnProfile && (
          <div className="flex justify-between max-w-3xl mx-auto mb-4">
            <motion.button
              className="p-2 rounded-full bg-toon-blue/10 flex items-center justify-center"
              onClick={handleOpenSettings}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-toon-blue" />
            </motion.button>
            
            <motion.button
              className="p-2 rounded-full bg-toon-blue/10 flex items-center justify-center"
              onClick={handleShareProfile}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Share profile"
            >
              <Share className="w-5 h-5 text-toon-blue" />
            </motion.button>
          </div>
        )}
        
        <motion.div 
          className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative flex items-center gap-4">
            <div 
              className={`w-32 h-32 rounded-full bg-toon-blue/10 flex items-center justify-center overflow-hidden ${isOwnProfile ? 'cursor-pointer' : ''}`}
              onClick={() => isOwnProfile && handleEditProfilePicture()}
            >
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt={profileName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <UserRound className="w-16 h-16 text-toon-blue" />
              )}
            </div>
            
            {isOwnProfile && (
              <motion.button
                className="p-3 rounded-full bg-toon-blue/10 flex items-center justify-center hover:bg-toon-blue/20 transition-colors"
                onClick={handleEditProfile}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Edit profile"
              >
                <Pencil className="w-5 h-5 text-toon-blue" />
              </motion.button>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mt-4 mb-1">{profileName}</h1>
          <p className="text-gray-500 mb-2">{profileEmail}</p>
          {profileBio && <p className="text-gray-700 text-center mb-6 max-w-md">{profileBio}</p>}
          
          <div className="flex justify-center w-full gap-12 mb-8">
            <motion.button
              className="flex flex-col items-center"
              onClick={handleShowFollowing}
              whileHover={{ y: -2 }}
            >
              <p className="text-2xl font-bold text-toon-blue">{userProfile?.following?.length || 0}</p>
              <p className="text-sm text-gray-500">Following</p>
            </motion.button>
            
            <motion.button
              className="flex flex-col items-center"
              onClick={handleShowFollowers}
              whileHover={{ y: -2 }}
            >
              <p className="text-2xl font-bold text-toon-blue">{userProfile?.followers?.length || 0}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </motion.button>
          </div>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="clips">Clips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-4">
              <div className="grid grid-cols-3 gap-1">
                {getFilteredContent('post').map(post => (
                  <div key={post.id} className="aspect-square bg-gray-100 overflow-hidden rounded-sm">
                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="mt-4">
              <div className="grid grid-cols-3 gap-1">
                {getFilteredContent('video').map(video => (
                  <div key={video.id} className="aspect-square bg-gray-100 overflow-hidden rounded-sm relative">
                    <img src={video.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[14px] border-l-white ml-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="clips" className="mt-4">
              <div className="grid grid-cols-3 gap-1">
                {getFilteredContent('clip').map(clip => (
                  <div key={clip.id} className="aspect-square bg-gray-100 overflow-hidden rounded-sm relative">
                    <img src={clip.imageUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Dialog open={showFollowDialog} onOpenChange={setShowFollowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{followType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {userProfile && (followType === 'followers' ? userProfile.followers : userProfile.following).map((user: any) => (
              <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                <Avatar className="h-10 w-10">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="bg-toon-blue/10">
                      <UserRound className="w-5 h-5 text-toon-blue" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-grow">
                  <p className="font-medium">{user.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    followType === 'followers' ? "border-toon-blue text-toon-blue" : "bg-toon-blue text-white"
                  )}
                >
                  {followType === 'followers' ? 'Follow' : 'Following'}
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Edit Profile</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowEditDialog(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <div className="space-y-4">
              <div>
                <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="profileName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="profileEmail"
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="profileBio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <Input
                  id="profileBio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us about yourself"
                />
              </div>
              
              <Button 
                className="w-full bg-toon-blue hover:bg-toon-blue/90"
                onClick={handleSaveProfile}
              >
                <Check className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showProfilePictureDialog} onOpenChange={setShowProfilePictureDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Change Profile Picture</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowProfilePictureDialog(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <div className="flex justify-center mb-4">
              <div className="flex flex-col items-center gap-2 w-full">
                <ImageUploader 
                  onImageSelect={handleImageSelect} 
                  selectedImage={selectedImage} 
                  onClearImage={handleClearImage} 
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowProfilePictureDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-toon-blue hover:bg-toon-blue/90"
                onClick={handleSaveProfilePicture}
                disabled={!selectedImage}
              >
                <Check className="mr-2 h-4 w-4" />
                Save Picture
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

export default Profile;
