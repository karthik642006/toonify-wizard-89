
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import Index from "./pages/Index";
import Clips from "./pages/Clips";
import Upload from "./pages/Upload";
import Jobs from "./pages/Jobs";
import Message from "./pages/Message";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

// Create auth context
export const AuthContext = createContext<{
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const queryClient = new QueryClient();

const App = () => {
  // In a real app, this would check for a valid token in localStorage or cookies
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check if user is authenticated on app load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = () => {
    // In a real app, this would store the actual token
    localStorage.setItem('auth_token', 'dummy_token');
    setIsAuthenticated(true);
  };
  
  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
  };

  // Auth required route wrapper
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
    return children;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/signin" element={
                isAuthenticated ? <Navigate to="/" replace /> : <SignIn />
              } />
              <Route path="/signup" element={
                isAuthenticated ? <Navigate to="/" replace /> : <SignUp />
              } />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              <Route path="/clips" element={
                <ProtectedRoute>
                  <Clips />
                </ProtectedRoute>
              } />
              <Route path="/upload" element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } />
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              } />
              <Route path="/message" element={
                <ProtectedRoute>
                  <Message />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AuthContext.Provider>
  );
};

export default App;
