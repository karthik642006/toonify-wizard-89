
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2 } from 'lucide-react';

export interface GalleryItem {
  id: string;
  original: string;
  transformed: string;
  styleName: string;
  timestamp: string;
}

interface GalleryProps {
  items: GalleryItem[];
  onDownload: (item: GalleryItem) => void;
  onDelete: (itemId: string) => void;
}

const Gallery = ({ items, onDownload, onDelete }: GalleryProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <motion.div 
        className="w-full text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-gray-500">Your gallery is empty. Transform an image to see it here.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              layout
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div className="relative aspect-video">
                <img
                  src={item.transformed}
                  alt={`Transformed with ${item.styleName}`}
                  className="w-full h-full object-cover"
                />
                
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.button
                        className="p-2 bg-white/90 rounded-full text-toon-blue hover:bg-white transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDownload(item)}
                      >
                        <Download className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="p-3">
                <p className="font-medium text-sm">{item.styleName}</p>
                <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Gallery;
