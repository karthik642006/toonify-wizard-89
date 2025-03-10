
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
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedTab, setSelectedTab] = useState("post");
  const [caption, setCaption] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage({ file, preview });
    toast.success('Image selected');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  const handleUpload = () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    // Create a new post/video/clip object
    const newContent: Post = {
      id: uuidv4(),
      imageUrl: selectedImage.preview,
      type: selectedTab as 'post' | 'video' | 'clip',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      userId: user?.username || 'johndoe',
      username: user?.username || 'John Doe',
      profileImage: 'https://i.pravatar.cc/150?img=11'
    };

    // In a real app, you would save this to a database
    // For now, we'll just add it to localStorage
    const existingContent = JSON.parse(localStorage.getItem('userContent') || '[]');
    localStorage.setItem('userContent', JSON.stringify([newContent, ...existingContent]));

    toast.success(`${selectedTab} uploaded successfully!`);
    navigate('/profile');
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
                selectedImage={selectedImage?.preview || null}
                onClearImage={handleClearImage}
              />
            </TabsContent>
            
            <TabsContent value="clip" className="mt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <Button onClick={() => handleImageSelect(new File([], 'clip.mp4'), 'https://i.pravatar.cc/300?img=7')}>Select Video</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="video" className="mt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <Button onClick={() => handleImageSelect(new File([], 'video.mp4'), 'https://i.pravatar.cc/300?img=5')}>Select Video</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {selectedImage && (
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
