
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNavigation from '../components/BottomNavigation';
import ImageUploader from '../components/ImageUploader';
import { useState } from 'react';
import { toast } from 'sonner';

const Upload = () => {
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage({ file, preview });
    toast.success('Image selected');
  };

  const handleClearImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
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
            Upload New Image
          </motion.div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-toon-blue to-toon-purple bg-clip-text text-transparent">
            Start Your Transformation
          </h1>
          <p className="text-lg text-gray-600">
            Upload your photo and choose a style to transform it into a unique artwork.
          </p>
        </motion.div>
        
        <div className="max-w-3xl mx-auto">
          <ImageUploader 
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage?.preview || null}
            onClearImage={handleClearImage}
          />
          
          {selectedImage && (
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <button
                className="px-6 py-3 bg-toon-blue text-white rounded-lg font-medium hover:bg-toon-blue/90 transition-colors"
                onClick={() => {
                  toast.success('Image uploaded');
                  window.location.href = '/';
                }}
              >
                Continue to Transform
              </button>
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
