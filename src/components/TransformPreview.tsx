
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Download, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

interface TransformPreviewProps {
  originalImage: string | null;
  transformedImage: string | null;
  isLoading: boolean;
  transformation: {
    styleName: string;
    timestamp: string;
  };
  onDownload: () => void;
  onBack: () => void;
}

const TransformPreview = ({
  originalImage,
  transformedImage,
  isLoading,
  transformation,
  onDownload,
  onBack
}: TransformPreviewProps) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Handle slider position changes
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  // Handle mouse movement on the comparison view
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!compareMode) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; 
    const percent = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percent, 0), 100));
  };

  if (!originalImage) return null;

  return (
    <motion.div 
      className="w-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.button
          className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-toon-blue transition-colors"
          onClick={onBack}
          whileHover={{ x: -2 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>
        
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              !compareMode && !showOriginal 
                ? 'bg-toon-blue text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setShowOriginal(false);
              setCompareMode(false);
            }}
          >
            Result
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              !compareMode && showOriginal 
                ? 'bg-toon-blue text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setShowOriginal(true);
              setCompareMode(false);
            }}
          >
            Original
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              compareMode 
                ? 'bg-toon-blue text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => {
              setCompareMode(!compareMode);
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
        
        <motion.button
          className="flex items-center gap-1 text-sm font-medium text-toon-blue hover:text-toon-blue/80 transition-colors"
          onClick={onDownload}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </motion.button>
      </div>
      
      <div 
        className="relative rounded-xl overflow-hidden aspect-video w-full shadow-lg"
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-toon-blue/30 border-t-toon-blue rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm font-medium text-gray-600">Transforming your image...</p>
              </div>
            </motion.div>
          ) : compareMode ? (
            <div className="relative w-full h-full">
              <img 
                src={originalImage} 
                alt="Original" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 overflow-hidden" 
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={transformedImage || originalImage} 
                  alt="Transformed" 
                  className="absolute inset-0 w-[100vw] max-w-none h-full object-cover"
                  style={{ 
                    left: `calc(50% - ${sliderPosition}vw)`,
                  }}
                />
              </div>
              <div 
                className="absolute inset-y-0" 
                style={{ left: `calc(${sliderPosition}% - 1px)` }}
              >
                <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg"></div>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center cursor-grab">
                  <ArrowLeft className="w-3 h-3 text-gray-500" />
                  <ArrowRight className="w-3 h-3 text-gray-500" />
                </div>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-grab"
              />
              
              <div className="absolute bottom-4 left-4 glass py-1 px-3 rounded-full text-xs font-medium">
                Original
              </div>
              <div className="absolute bottom-4 right-4 glass py-1 px-3 rounded-full text-xs font-medium">
                Transformed
              </div>
            </div>
          ) : (
            <motion.img 
              src={showOriginal ? originalImage : (transformedImage || originalImage)} 
              alt={showOriginal ? "Original" : "Transformed"}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-sm text-gray-500">
          {!showOriginal && !isLoading && transformedImage ? (
            <>Transformed with <span className="font-medium text-toon-blue">{transformation.styleName}</span> style</>
          ) : showOriginal ? (
            <>Original image</>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      </div>
    </motion.div>
  );
};

export default TransformPreview;
