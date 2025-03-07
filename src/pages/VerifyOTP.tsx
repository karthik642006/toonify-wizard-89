
import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AuthContext } from '../App';

const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';
  const { login } = useContext(AuthContext);
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  // Redirect if no email is provided (direct access to page)
  useEffect(() => {
    if (!email) {
      navigate('/signin');
      toast.error('Please sign in first');
    }
  }, [email, navigate]);
  
  // Countdown timer for resend OTP
  useEffect(() => {
    if (timeLeft === 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move focus to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  
  const handleResendOtp = () => {
    if (timeLeft > 0) return;
    
    toast.info('New OTP sent to your email');
    setTimeLeft(60);
  };
  
  const handleVerifyOtp = () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate OTP verification - in a real app, this would call your auth API
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Account verified successfully');
      // Log the user in and navigate to home page
      login();
      navigate('/');
    }, 1500);
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
            <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a verification code to<br />
              <span className="font-medium">{email}</span>
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  autoComplete="off"
                />
              ))}
            </div>
            
            <Button 
              className="w-full bg-toon-blue hover:bg-toon-blue/90"
              onClick={handleVerifyOtp}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Verifying...
                </span>
              ) : (
                'Verify and Continue'
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button
                  className={`font-medium ${timeLeft > 0 ? 'text-gray-400' : 'text-toon-blue hover:underline'}`}
                  onClick={handleResendOtp}
                  disabled={timeLeft > 0}
                >
                  {timeLeft > 0 ? `Resend in ${timeLeft}s` : 'Resend code'}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerifyOTP;
