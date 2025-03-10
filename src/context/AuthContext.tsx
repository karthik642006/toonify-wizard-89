
import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  name?: string;
  email?: string;
  profilePicture?: string;
}

interface AuthContextType {
  login: (username: string, password: string) => void;
  user: User | null;
}

const defaultContext: AuthContextType = {
  login: () => {},
  user: null
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

  return (
    <AuthContext.Provider value={{ login, user }}>
      {children}
    </AuthContext.Provider>
  );
};
