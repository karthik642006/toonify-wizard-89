
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Post } from '../models/post';
import { mockUsers, mockPosts, User } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export const useProfileData = (username?: string) => {
  const navigate = useNavigate();
  const { user, updateUserProfile, followUser, unfollowUser, isFollowing } = useAuth();
  
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
    // Use a try-catch block to handle potential errors
    try {
      const targetUsername = username || (user?.username || 'johndoe');
      let foundUser = mockUsers.find(u => u.username === targetUsername);
      
      // If viewing the logged-in user's profile, use auth context data
      if (!username || (user && targetUsername === user.username)) {
        foundUser = {
          ...(foundUser || {}),
          ...user,
          followers: user?.followers || [],
          following: user?.following || [],
        } as User;
      }
      
      if (foundUser) {
        setUserProfile(foundUser);
        setProfileName(foundUser.name || foundUser.username);
        setProfileEmail(foundUser.email || '');
        setProfileBio(foundUser.bio || '');
        setProfilePicture(foundUser.profilePicture || null);
        
        // Get posts from mock data
        let posts = mockPosts.filter(post => post.userId === foundUser.username);
        
        // Also load user content from localStorage
        try {
          const userContent = JSON.parse(localStorage.getItem('userContent') || '[]');
          const userSpecificContent = userContent.filter((item: Post) => 
            item.userId === foundUser.username || (!username && item.userId === user?.username)
          );
          
          setUserPosts([...userSpecificContent, ...posts]);
        } catch (error) {
          console.error('Error loading user content:', error);
          setUserPosts(posts);
        }
        
        setIsOwnProfile(targetUsername === (user?.username || 'johndoe') || !username);
      } else {
        console.log('User not found:', targetUsername);
        setUserPosts([]);
      }
    } catch (error) {
      console.error('Error in useProfileData effect:', error);
    }
  }, [username, user]);

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
    
    // Update user context if available
    if (updateUserProfile) {
      updateUserProfile({
        name: editName,
        email: editEmail,
        bio: editBio
      });
    }
    
    setShowEditDialog(false);
    toast.success('Profile updated successfully');
  };

  const handleSaveProfilePicture = () => {
    if (selectedImage) {
      setProfilePicture(selectedImage);
      
      // Update profile picture in auth context
      if (updateUserProfile) {
        updateUserProfile({
          profilePicture: selectedImage
        });
      }
      
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
  
  const handleFollow = (userId: string, userName: string, userAvatar?: string) => {
    if (followUser) {
      followUser(userId, userName, userAvatar);
    }
  };
  
  const handleUnfollow = (userId: string) => {
    if (unfollowUser) {
      unfollowUser(userId);
    }
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
    handleFollow,
    handleUnfollow,
    isFollowing
  };
};
