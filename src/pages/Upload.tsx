
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

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedTab, setSelectedTab] = useState("post");
  const navigate = useNavigate();

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage({ file, preview });
    toast.success('Image selected');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  const handleUpload = () => {
    toast.success(`${selectedTab} uploaded`);
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block px-3 py-1 mb-4 rounded-full bg-toon-blue/10 text-toon-blue text-xs font-medium"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Upload
          </motion.div>
        </motion.div>
        
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
                <Button>Select Video</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="video" className="mt-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Video className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <Button>Select Video</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {((selectedTab === "post" && selectedImage) || selectedTab !== "post") && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                className="px-6 py-3 bg-toon-blue text-white rounded-lg font-medium hover:bg-toon-blue/90 transition-colors"
                onClick={handleUpload}
              >
                Upload
              </Button>
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
