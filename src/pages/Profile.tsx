
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { UserRound, Settings, Share, Pencil, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FollowType = 'followers' | 'following';

const Profile = () => {
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [followType, setFollowType] = useState<FollowType>('followers');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState('user@example.com');
  const [profileBio, setProfileBio] = useState('UI/UX Designer | Developer | Content Creator');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();
  
  const followers = [
    { id: 1, name: 'Alex Johnson', avatar: null },
    { id: 2, name: 'Maria Garcia', avatar: null },
    { id: 3, name: 'Tyler Wilson', avatar: null },
  ];

  const following = [
    { id: 4, name: 'Emma Thompson', avatar: null },
    { id: 5, name: 'Carlos Rodriguez', avatar: null },
  ];

  // Sample user content
  const userPosts = [
    { id: 1, imageUrl: 'https://i.pravatar.cc/300?img=1' },
    { id: 2, imageUrl: 'https://i.pravatar.cc/300?img=2' },
    { id: 3, imageUrl: 'https://i.pravatar.cc/300?img=3' },
    { id: 4, imageUrl: 'https://i.pravatar.cc/300?img=4' },
  ];
  
  const userVideos = [
    { id: 1, thumbnailUrl: 'https://i.pravatar.cc/300?img=5' },
    { id: 2, thumbnailUrl: 'https://i.pravatar.cc/300?img=6' },
  ];

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
    // Share profile by copying link to clipboard
    const profileUrl = window.location.href;
    navigator.clipboard.writeText(profileUrl)
      .then(() => toast.success('Profile link copied to clipboard!'))
      .catch(err => toast.error('Could not copy the profile link'));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-24 px-6 mx-auto">
        {/* Settings and Share buttons */}
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
        
        <motion.div 
          className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative flex items-center gap-4">
            {/* Profile Picture */}
            <div 
              className="w-32 h-32 rounded-full bg-toon-blue/10 flex items-center justify-center overflow-hidden cursor-pointer" 
              onClick={handleEditProfilePicture}
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
            
            {/* Edit profile button (moved to the right side) */}
            <motion.button
              className="p-3 rounded-full bg-toon-blue/10 flex items-center justify-center hover:bg-toon-blue/20 transition-colors"
              onClick={handleEditProfile}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Edit profile"
            >
              <Pencil className="w-5 h-5 text-toon-blue" />
            </motion.button>
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
              <p className="text-2xl font-bold text-toon-blue">{following.length}</p>
              <p className="text-sm text-gray-500">Following</p>
            </motion.button>
            
            <motion.button
              className="flex flex-col items-center"
              onClick={handleShowFollowers}
              whileHover={{ y: -2 }}
            >
              <p className="text-2xl font-bold text-toon-blue">{followers.length}</p>
              <p className="text-sm text-gray-500">Followers</p>
            </motion.button>
          </div>
        </motion.div>
        
        {/* User Content Tabs */}
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-4">
              <div className="grid grid-cols-3 gap-1">
                {userPosts.map(post => (
                  <div key={post.id} className="aspect-square bg-gray-100 overflow-hidden rounded-sm">
                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className="mt-4">
              <div className="grid grid-cols-3 gap-1">
                {userVideos.map(video => (
                  <div key={video.id} className="aspect-square bg-gray-100 overflow-hidden rounded-sm relative">
                    <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[14px] border-l-white ml-1"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Followers/Following Dialog */}
      <Dialog open={showFollowDialog} onOpenChange={setShowFollowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{followType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {(followType === 'followers' ? followers : following).map(user => (
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
      
      {/* Edit Profile Dialog */}
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
      
      {/* Profile Picture Dialog */}
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
