
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import ImageUploader from '../components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { FileImage, Video, Film } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { Post } from '../models/post';

const Upload = () => {
  const [selectedMedia, setSelectedMedia] = useState<{ file: File; preview: string; type: 'image' | 'video' | 'clip' } | null>(null);
  const [selectedTab, setSelectedTab] = useState("post");
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedMedia({ file, preview, type: 'image' });
    toast.success('Image selected');
  };

  const handleVideoSelect = (file: File, preview: string, type: 'video' | 'clip') => {
    setSelectedMedia({ file, preview, type });
    toast.success(`${type === 'video' ? 'Video' : 'Clip'} selected`);
  };

  const handleClearMedia = () => {
    setSelectedMedia(null);
  };

  const handleUpload = () => {
    if (!selectedMedia) {
      toast.error('Please select media first');
      return;
    }

    // Create a new post/video/clip object
    const newContent: Post = {
      id: uuidv4(),
      imageUrl: selectedMedia.preview,
      videoUrl: selectedMedia.type !== 'image' ? selectedMedia.preview : undefined,
      type: selectedTab as 'post' | 'video' | 'clip',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      userId: user?.username || 'johndoe',
      username: user?.name || 'John Doe',
      profileImage: user?.profilePicture || 'https://i.pravatar.cc/150?img=11'
    };

    // In a real app, you would save this to a database
    // For now, we'll just add it to localStorage
    try {
      const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
      localStorage.setItem('userContent', JSON.stringify([newContent, ...existingContent]));
      toast.success(`${selectedTab} uploaded successfully!`);
      navigate('/profile');
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      toast.error("Failed to save your upload");
    }
  };

  // Mock video URLs for demonstration
  const demoVideoUrls = {
    clip: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    video: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4'
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="post" value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
              <TabsTrigger value="post" className="flex items-center gap-2">
                <FileImage className="w-4 h-4" />
                <span>Post</span>
              </TabsTrigger>
              <TabsTrigger value="clip" className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                <span>Clip</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Video</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="post" className="mt-6">
              <ImageUploader 
                onImageSelect={handleImageSelect}
                selectedImage={selectedMedia?.type === 'image' ? selectedMedia.preview : null}
                onClearImage={handleClearMedia}
              />
            </TabsContent>
            
            <TabsContent value="clip" className="mt-6">
              {selectedMedia?.type === 'clip' ? (
                <div className="relative rounded-xl overflow-hidden aspect-video w-full shadow-sm group">
                  <video 
                    src={selectedMedia.preview} 
                    className="w-full h-full object-cover" 
                    controls
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <Button 
                      variant="destructive"
                      onClick={handleClearMedia}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Button 
                    onClick={() => handleVideoSelect(
                      new File([], 'clip.mp4'), 
                      demoVideoUrls.clip, 
                      'clip'
                    )}
                  >
                    Select Clip
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="video" className="mt-6">
              {selectedMedia?.type === 'video' ? (
                <div className="relative rounded-xl overflow-hidden aspect-video w-full shadow-sm group">
                  <video 
                    src={selectedMedia.preview} 
                    className="w-full h-full object-cover" 
                    controls
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                    <Button 
                      variant="destructive"
                      onClick={handleClearMedia}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <Button 
                    onClick={() => handleVideoSelect(
                      new File([], 'video.mp4'), 
                      demoVideoUrls.video,
                      'video'
                    )}
                  >
                    Select Video
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          {selectedMedia && (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <textarea
                placeholder="Write a caption..."
                className="w-full p-3 border rounded-lg resize-none h-24"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
              
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  className="px-6 py-3 bg-toon-blue text-white rounded-lg font-medium hover:bg-toon-blue/90 transition-colors"
                  onClick={handleUpload}
                >
                  Upload
                </Button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
      <BottomNavigation />
    </div>
  );
};

export default Upload;
