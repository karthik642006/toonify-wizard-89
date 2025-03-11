
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BottomNavigation from '../../components/BottomNavigation';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import FollowDialog from './FollowDialog';
import EditProfileDialog from './EditProfileDialog';
import ProfilePictureDialog from './ProfilePictureDialog';
import { useProfileData } from '../../hooks/useProfileData';

const Profile = () => {
  const { username } = useParams();
  const {
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
  } = useProfileData(username);

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-24 px-6 mx-auto">
        <ProfileHeader 
          profileName={profileName}
          profileEmail={profileEmail}
          profileBio={profileBio}
          profilePicture={profilePicture}
          followersCount={userProfile?.followers?.length || 0}
          followingCount={userProfile?.following?.length || 0}
          isOwnProfile={isOwnProfile}
          onShowFollowers={handleShowFollowers}
          onShowFollowing={handleShowFollowing}
          onEditProfile={handleEditProfile}
          onEditProfilePicture={handleEditProfilePicture}
          onOpenSettings={handleOpenSettings}
          onShareProfile={handleShareProfile}
        />
        
        <ProfileTabs 
          posts={userPosts}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </main>
      
      <FollowDialog 
        open={showFollowDialog}
        onOpenChange={setShowFollowDialog}
        followType={followType}
        users={userProfile ? (followType === 'followers' ? userProfile.followers : userProfile.following) : []}
      />
      
      <EditProfileDialog 
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        editName={editName}
        setEditName={setEditName}
        editEmail={editEmail}
        setEditEmail={setEditEmail}
        editBio={editBio}
        setEditBio={setEditBio}
        onSave={handleSaveProfile}
      />
      
      <ProfilePictureDialog 
        open={showProfilePictureDialog}
        onOpenChange={setShowProfilePictureDialog}
        selectedImage={selectedImage}
        onImageSelect={handleImageSelect}
        onClearImage={handleClearImage}
        onSave={handleSaveProfilePicture}
      />
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Profile;
