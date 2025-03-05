
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

import Header from '../components/Header';
import ImageUploader from '../components/ImageUploader';
import StyleSelector, { ToonStyle } from '../components/StyleSelector';
import TransformPreview from '../components/TransformPreview';
import Gallery, { GalleryItem } from '../components/Gallery';
import Footer from '../components/Footer';

import { 
  toonStyles, 
  transformImage, 
  saveTransformedImage, 
  getGalleryItems, 
  downloadImage, 
  deleteGalleryItem 
} from '../utils/imageTransform';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<{ file: File; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>(toonStyles[0].id);
  const [transformedImage, setTransformedImage] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState<boolean>(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeView, setActiveView] = useState<'upload' | 'preview'>('upload');
  const [transformation, setTransformation] = useState<{ styleName: string; timestamp: string }>({
    styleName: '',
    timestamp: ''
  });

  // Load gallery items from local storage on mount
  useEffect(() => {
    setGalleryItems(getGalleryItems());
  }, []);

  // Handle image selection
  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage({ file, preview });
    setTransformedImage(null);
    setActiveView('upload');
  };

  // Handle image clearing
  const handleClearImage = () => {
    setSelectedImage(null);
    setTransformedImage(null);
    setActiveView('upload');
  };

  // Handle style selection
  const handleStyleSelect = (styleId: string) => {
    setSelectedStyle(styleId);
  };

  // Handle image transformation
  const handleTransform = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    try {
      setIsTransforming(true);
      
      const result = await transformImage(selectedImage.preview, selectedStyle);
      
      setTransformedImage(result);
      
      // Get style name
      const style = toonStyles.find(s => s.id === selectedStyle);
      
      // Update transformation details
      setTransformation({
        styleName: style?.name || 'Custom',
        timestamp: new Date().toISOString()
      });
      
      // Save to gallery
      const galleryItem = saveTransformedImage(selectedImage.preview, result, selectedStyle);
      setGalleryItems(prevItems => [galleryItem, ...prevItems]);
      
      setActiveView('preview');
      
      toast.success('Transformation complete!');
    } catch (error) {
      console.error('Transformation error:', error);
      toast.error('Failed to transform image');
    } finally {
      setIsTransforming(false);
    }
  };

  // Handle image download
  const handleDownload = () => {
    if (!transformedImage) return;
    
    const style = toonStyles.find(s => s.id === selectedStyle);
    const filename = `toonify-${style?.name.toLowerCase() || 'custom'}-${Date.now()}.jpg`;
    
    downloadImage(transformedImage, filename);
    toast.success('Image downloaded');
  };

  // Handle gallery item download
  const handleGalleryItemDownload = (item: GalleryItem) => {
    const filename = `toonify-${item.styleName.toLowerCase()}-${Date.now()}.jpg`;
    downloadImage(item.transformed, filename);
    toast.success('Image downloaded');
  };

  // Handle gallery item deletion
  const handleGalleryItemDelete = (itemId: string) => {
    deleteGalleryItem(itemId);
    setGalleryItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.success('Deleted from gallery');
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container max-w-6xl pt-24 pb-12 px-6 mx-auto">
        <section className="mb-20">
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
              Transform your images with AI
            </motion.div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-toon-blue to-toon-purple bg-clip-text text-transparent">
              Turn Photos into Stylized Art
            </h1>
            <p className="text-lg text-gray-600">
              Transform your ordinary photos into stunning cartoon styles with just a few clicks. 
              Choose from multiple art styles and create unique stylized versions.
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeView === 'upload' ? (
                <motion.div
                  key="upload-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <ImageUploader 
                    onImageSelect={handleImageSelect}
                    selectedImage={selectedImage?.preview || null}
                    onClearImage={handleClearImage}
                  />
                  
                  {selectedImage && (
                    <>
                      <StyleSelector 
                        styles={toonStyles}
                        selectedStyle={selectedStyle}
                        onSelectStyle={handleStyleSelect}
                        disabled={isTransforming}
                      />
                      
                      <motion.div
                        className="flex justify-center mt-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <button
                          className="px-6 py-3 bg-toon-blue text-white rounded-lg font-medium hover:bg-toon-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleTransform}
                          disabled={isTransforming || !selectedImage}
                        >
                          {isTransforming ? 'Transforming...' : 'Transform Image'}
                        </button>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="preview-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TransformPreview 
                    originalImage={selectedImage?.preview || null}
                    transformedImage={transformedImage}
                    isLoading={isTransforming}
                    transformation={transformation}
                    onDownload={handleDownload}
                    onBack={() => setActiveView('upload')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        
        <section id="gallery" className="pt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Your Gallery</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All your transformed images are saved here. You can download or delete them anytime.
            </p>
          </div>
          
          <Gallery 
            items={galleryItems}
            onDownload={handleGalleryItemDownload}
            onDelete={handleGalleryItemDelete}
          />
        </section>
        
        <section id="about" className="py-20">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              About Toonify Wizard
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Toonify Wizard is a powerful tool that leverages AI to transform your photos into 
              stylized cartoon versions. Our app offers a variety of artistic styles to choose from, 
              giving you endless creative possibilities.
            </motion.p>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              All transformations happen in your browser, ensuring your photos remain private and secure.
              No data is sent to external servers or stored permanently outside your device.
            </motion.p>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
