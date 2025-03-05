
import { useState } from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToonStyle {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface StyleSelectorProps {
  styles: ToonStyle[];
  selectedStyle: string;
  onSelectStyle: (styleId: string) => void;
  disabled?: boolean;
}

const StyleSelector = ({ styles, selectedStyle, onSelectStyle, disabled = false }: StyleSelectorProps) => {
  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-4">Choose a style</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {styles.map((style) => (
          <StyleCard
            key={style.id}
            style={style}
            selected={selectedStyle === style.id}
            onSelect={() => onSelectStyle(style.id)}
            disabled={disabled}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface StyleCardProps {
  style: ToonStyle;
  selected: boolean;
  onSelect: () => void;
  disabled: boolean;
}

const StyleCard = ({ style, selected, onSelect, disabled }: StyleCardProps) => {
  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden cursor-pointer transition-all ${
        selected ? 'ring-2 ring-toon-blue' : 'hover:shadow-md'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="aspect-square relative">
        <img 
          src={style.thumbnail} 
          alt={style.name}
          className="w-full h-full object-cover"
        />
        <AnimatePresence>
          {selected && (
            <motion.div 
              className="absolute inset-0 bg-toon-blue/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="p-1.5 rounded-full bg-white/90 shadow-sm">
                <Check className="w-3.5 h-3.5 text-toon-blue" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-2 text-center">
        <p className="text-sm font-medium truncate">{style.name}</p>
      </div>
    </motion.div>
  );
};

export default StyleSelector;
