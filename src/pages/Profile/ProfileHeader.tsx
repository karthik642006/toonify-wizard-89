
import { motion } from 'framer-motion';
import { UserRound, Pencil, Settings, Share } from 'lucide-react';
import { User } from '../../data/mockData';

interface ProfileHeaderProps {
  profileName: string;
  profileEmail: string;
  profileBio: string;
  profilePicture: string | null;
  followersCount: number;
  followingCount: number;
  isOwnProfile: boolean;
  onShowFollowers: () => void;
  onShowFollowing: () => void;
  onEditProfile: () => void;
  onEditProfilePicture: () => void;
  onOpenSettings: () => void;
  onShareProfile: () => void;
}

const ProfileHeader = ({
  profileName,
  profileEmail,
  profileBio,
  profilePicture,
  followersCount,
  followingCount,
  isOwnProfile,
  onShowFollowers,
  onShowFollowing,
  onEditProfile,
  onEditProfilePicture,
  onOpenSettings,
  onShareProfile,
}: ProfileHeaderProps) => {
  return (
    <>
      {isOwnProfile && (
        <div className="flex justify-between max-w-3xl mx-auto mb-4">
          <motion.button
            className="p-2 rounded-full bg-toon-blue/10 flex items-center justify-center"
            onClick={onOpenSettings}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-toon-blue" />
          </motion.button>
          
          <motion.button
            className="p-2 rounded-full bg-toon-blue/10 flex items-center justify-center"
            onClick={onShareProfile}
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
            onClick={() => isOwnProfile && onEditProfilePicture()}
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
              onClick={onEditProfile}
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
            onClick={onShowFollowing}
            whileHover={{ y: -2 }}
          >
            <p className="text-2xl font-bold text-toon-blue">{followingCount}</p>
            <p className="text-sm text-gray-500">Following</p>
          </motion.button>
          
          <motion.button
            className="flex flex-col items-center"
            onClick={onShowFollowers}
            whileHover={{ y: -2 }}
          >
            <p className="text-2xl font-bold text-toon-blue">{followersCount}</p>
            <p className="text-sm text-gray-500">Followers</p>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
};

export default ProfileHeader;
