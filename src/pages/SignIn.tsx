import { motion } from 'framer-motion';
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../App';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate authentication - in a real app, this would call your auth API
    try {
      // For demo purposes, we'll simulate a successful login and redirect to OTP verification
      setTimeout(() => {
        setIsLoading(false);
        toast.success('Verification code sent to your email');
        navigate('/verify-otp', { state: { email } });
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-24 px-6 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
          </div>
          
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Link to="/reset-password" className="text-xs text-toon-blue hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-toon-blue hover:bg-toon-blue/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-toon-blue font-medium hover:underline">
                Sign up now
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignIn;
