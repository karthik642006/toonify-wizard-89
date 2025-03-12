
/**
 * Helper utility for handling video playback across the app
 */

// Fix for videos from external sources
export const getCompatibleVideoUrl = (url: string | null): string => {
  if (!url) return '';
  
  // Replace problematic URLs with local fallbacks
  if (url.includes('mixkit.co') || url.includes('assets.mixkit.co')) {
    // For demo purposes, use a local video that's guaranteed to work
    return '/video-placeholder.mp4';
  }
  
  // If it's a blob URL from user upload, it should work as is
  if (url.startsWith('blob:')) {
    return url;
  }
  
  return url;
};

// Try to play video with error handling
export const tryPlayVideo = async (videoElement: HTMLVideoElement | null): Promise<boolean> => {
  if (!videoElement) return false;
  
  try {
    await videoElement.play();
    return true;
  } catch (error) {
    console.error("Error playing video:", error);
    return false;
  }
};

// Check if a video is playable
export const isVideoPlayable = (url: string | null): boolean => {
  if (!url) return false;
  
  // Simple check for commonly supported video formats
  const validExtensions = ['.mp4', '.webm', '.ogg'];
  return validExtensions.some(ext => url.toLowerCase().includes(ext));
};
