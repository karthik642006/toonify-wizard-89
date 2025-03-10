
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  login: (username: string, password: string) => void;
  user: any | null;
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
  const [user, setUser] = useState<any | null>(null);

  const login = (username: string, password: string) => {
    // Mock login for now
    setUser({ username });
  };

  return (
    <AuthContext.Provider value={{ login, user }}>
      {children}
    </AuthContext.Provider>
  );
};
