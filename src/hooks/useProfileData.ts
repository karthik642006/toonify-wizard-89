
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Post } from '../models/post';
import { mockUsers, mockPosts, User } from '../data/mockData';

export const useProfileData = (username?: string) => {
  const navigate = useNavigate();
  
  const [showFollowDialog, setShowFollowDialog] = useState(false);
  const [followType, setFollowType] = useState<'followers' | 'following'>('followers');
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
  const [userProfile, setUserProfile] = useState<User | null>(null);
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
      setProfilePicture(user.profilePicture || null);
      
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

  return {
    profileName,
    profileEmail,
    profileBio,
    profilePicture,
    editName,
    editEmail,
    editBio,
    selectedImage,
    activeTab,
    userProfile,
    userPosts,
    isOwnProfile,
    showFollowDialog,
    setShowFollowDialog,
    followType,
    showEditDialog,
    setShowEditDialog,
    showProfilePictureDialog,
    setShowProfilePictureDialog,
    setActiveTab,
    setEditName,
    setEditEmail,
    setEditBio,
    handleShowFollowers,
    handleShowFollowing,
    handleEditProfile,
    handleEditProfilePicture,
    handleSaveProfile,
    handleSaveProfilePicture,
    handleImageSelect,
    handleClearImage,
    handleOpenSettings,
    handleShareProfile,
  };
};
