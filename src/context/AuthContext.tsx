
import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  username: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  bio?: string;
}

interface ProfileUpdate {
  name?: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
}

interface AuthContextType {
  login: (username: string, password: string) => void;
  user: User | null;
  updateUserProfile: (update: ProfileUpdate) => void;
}

const defaultContext: AuthContextType = {
  login: () => {},
  user: null,
  updateUserProfile: () => {}
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>({
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    profilePicture: 'https://i.pravatar.cc/300?img=11'
  });

  const login = (username: string, password: string) => {
    // Mock login for now
    setUser({ 
      username,
      name: username === 'johndoe' ? 'John Doe' : username,
      email: `${username}@example.com`,
      profilePicture: 'https://i.pravatar.cc/300?img=11'
    });
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

  return (
    <AuthContext.Provider value={{ login, user, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
