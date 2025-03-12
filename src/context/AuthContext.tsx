
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  username: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  bio?: string;
  followers?: {id: string, name: string, avatar?: string}[];
  following?: {id: string, name: string, avatar?: string}[];
}

interface ProfileUpdate {
  name?: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  followers?: {id: string, name: string, avatar?: string}[];
  following?: {id: string, name: string, avatar?: string}[];
}

interface AuthContextType {
  login: (username: string, password: string) => void;
  user: User | null;
  updateUserProfile: (update: ProfileUpdate) => void;
  followUser: (userId: string, userName: string, userAvatar?: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
}

const defaultContext: AuthContextType = {
  login: () => {},
  user: null,
  updateUserProfile: () => {},
  followUser: () => {},
  unfollowUser: () => {},
  isFollowing: () => false
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user data from localStorage on initial render
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Set default user if none exists
        const defaultUser = {
          username: 'johndoe',
          name: 'John Doe',
          email: 'john@example.com',
          profilePicture: 'https://i.pravatar.cc/300?img=11',
          followers: [],
          following: []
        };
        setUser(defaultUser);
        localStorage.setItem('currentUser', JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set default user as fallback
      setUser({
        username: 'johndoe',
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'https://i.pravatar.cc/300?img=11',
        followers: [],
        following: []
      });
    }
  }, []);

  const login = (username: string, password: string) => {
    // Mock login for now
    const newUser = { 
      username,
      name: username === 'johndoe' ? 'John Doe' : username,
      email: `${username}@example.com`,
      profilePicture: 'https://i.pravatar.cc/300?img=11',
      followers: [],
      following: []
    };
    
    setUser(newUser);
    
    // Save to localStorage for persistence
    try {
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const updateUserProfile = (update: ProfileUpdate) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      
      const updatedUser = { ...prev, ...update };
      
      // Save to localStorage for persistence
      try {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error saving user data:', error);
      }
      
      toast.success("Profile updated successfully");
      return updatedUser;
    });
  };

  const followUser = (userId: string, userName: string, userAvatar?: string) => {
    if (!user) return;

    setUser(prev => {
      if (!prev) return prev;
      
      // Check if already following
      if (prev.following?.some(f => f.id === userId)) {
        return prev;
      }
      
      const newFollowing = [...(prev.following || []), {
        id: userId,
        name: userName,
        avatar: userAvatar
      }];
      
      const updatedUser = {
        ...prev,
        following: newFollowing
      };
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast.success(`You are now following ${userName}`);
      return updatedUser;
    });
  };

  const unfollowUser = (userId: string) => {
    if (!user) return;

    setUser(prev => {
      if (!prev) return prev;
      
      const updatedFollowing = prev.following?.filter(f => f.id !== userId) || [];
      
      const updatedUser = {
        ...prev,
        following: updatedFollowing
      };
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      toast.success("Unfollowed successfully");
      return updatedUser;
    });
  };

  const isFollowing = (userId: string): boolean => {
    if (!user || !user.following) return false;
    return user.following.some(f => f.id === userId);
  };

  return (
    <AuthContext.Provider value={{ 
      login, 
      user, 
      updateUserProfile,
      followUser,
      unfollowUser,
      isFollowing
    }}>
      {children}
    </AuthContext.Provider>
  );
};
