
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract email from location state or use a default
  const email = location.state?.email || 'your email';
  
  useEffect(() => {
    // Start countdown timer
    const countdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    return () => clearInterval(countdown);
  }, []);
  
  useEffect(() => {
    // Auto-submit when OTP is fully entered (6 digits)
    if (otp.length === 6) {
      handleVerify();
    }
  }, [otp]);
  
  const handleVerify = async () => {
    if (otp.length < 6) {
      toast.error('Please enter a complete OTP');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Mock verification - in a real app, this would make an API call
      setTimeout(() => {
        navigate('/');
        toast.success('OTP verified successfully');
      }, 1500);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOTP = () => {
    if (timer > 0) return;
    
    toast.success('New OTP sent to your email');
    setTimer(30);
    
    // Restart countdown timer
    const countdown = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
          <CardDescription className="text-center">
            We've sent a one-time password to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleVerify}
            disabled={otp.length < 6 || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={handleResendOTP}
            disabled={timer > 0}
          >
            Resend OTP {timer > 0 ? `(${timer}s)` : ''}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
