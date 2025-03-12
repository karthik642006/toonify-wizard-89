
import { useState, useEffect, useRef } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { getCompatibleVideoUrl, tryPlayVideo } from '../utils/videoHelper';

interface VideoPreviewProps {
  src: string | null;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onClick?: () => void;
}

const VideoPreview = ({
  src,
  className = "",
  autoPlay = false,
  loop = true,
  controls = false,
  onPlay,
  onPause,
  onEnded,
  onClick
}: VideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const compatibleSrc = getCompatibleVideoUrl(src);
  
  useEffect(() => {
    if (autoPlay && videoRef.current) {
      tryPlayVideo(videoRef.current)
        .then(success => {
          setIsPlaying(success);
          if (success && onPlay) onPlay();
        })
        .catch(() => setHasError(true));
    }
  }, [autoPlay, onPlay]);
  
  useEffect(() => {
    // Reset error state when src changes
    setHasError(false);
  }, [src]);
  
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      tryPlayVideo(videoRef.current)
        .then(success => {
          setIsPlaying(success);
          if (success && onPlay) onPlay();
        })
        .catch(() => setHasError(true));
    }
  };
  
  const handleVideoClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else {
      handlePlayPause();
    }
    e.stopPropagation();
  };
  
  const handleVideoEnd = () => {
    setIsPlaying(false);
    if (onEnded) onEnded();
  };
  
  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={compatibleSrc}
        className="w-full h-full object-cover"
        loop={loop}
        controls={controls}
        playsInline
        onEnded={handleVideoEnd}
        onError={() => setHasError(true)}
      />
      
      {!isPlaying && !hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
          onClick={handleVideoClick}
        >
          <button className="p-4 rounded-full bg-white/30 hover:bg-white/50 transition-colors">
            <Play className="w-8 h-8 text-white" />
          </button>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
          <p className="text-white text-sm">Video could not be played</p>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;
