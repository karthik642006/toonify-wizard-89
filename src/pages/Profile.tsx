
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import { UserRound, Settings, Share, Pencil, Users, X, Camera, Check, ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';

type FollowType = 'followers' | 'following';

const Profile = () => {
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [followType, setFollowType] = useState<FollowType>('followers');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState('user@example.com');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
          <div className="relative">
            <div 
              className="w-32 h-32 rounded-full bg-toon-blue/10 flex items-center justify-center mb-6 overflow-hidden" 
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
            
            {/* Edit profile picture button (top right) */}
            <motion.button
              className="absolute top-0 right-0 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
              onClick={handleEditProfilePicture}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Edit profile picture"
            >
              <Pencil className="w-4 h-4 text-toon-blue" />
            </motion.button>
          </div>
          
          <h1 className="text-2xl font-bold mb-1">{profileName}</h1>
          <p className="text-gray-500 mb-6">{profileEmail}</p>
          
          <div className="flex justify-center w-full gap-12 mb-8">
            <motion.button
              className="flex flex-col items-center"
              onClick={handleShowFollowing}
              whileHover={{ y: -2 }}
            >
              <p className="text-2xl font-bold text-toon-blue">{following.length}</p>
              <p className="text-sm text-gray-500">Following</p>
            </motion.button>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-toon-blue">42</p>
              <p className="text-sm text-gray-500">Transforms</p>
            </div>
            
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
                <div className="w-10 h-10 rounded-full bg-toon-blue/10 flex items-center justify-center">
                  <UserRound className="w-5 h-5 text-toon-blue" />
                </div>
                <div className="flex-grow">
                  <p className="font-medium">{user.name}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={cn(
                    followType === 'followers' ? "border-toon-blue text-toon-blue" : "bg-toon-blue text-white"
                  )}
                  onClick={() => toast.info(followType === 'followers' ? 'Follow back' : 'Unfollow')}
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
                <p className="text-xs text-gray-500 text-center mt-2">
                  Upload a photo from your device or take a new one with your camera
                </p>
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
