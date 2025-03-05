
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { GalleryItem } from '../components/Gallery';

// Mock transformation styles
export const toonStyles = [
  {
    id: 'pixar',
    name: 'Pixar',
    description: 'Transform your image in Pixar animation style',
    thumbnail: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Transform your image in Japanese anime style',
    thumbnail: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'comic',
    name: 'Comic Book',
    description: 'Transform your image in comic book style',
    thumbnail: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Transform your image in watercolor painting style',
    thumbnail: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3d',
    name: '3D Render',
    description: 'Transform your image in 3D rendered style',
    thumbnail: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mosaic',
    name: 'Mosaic',
    description: 'Transform your image in mosaic tile style',
    thumbnail: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sketch',
    name: 'Pencil Sketch',
    description: 'Transform your image in pencil sketch style',
    thumbnail: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'oil',
    name: 'Oil Painting',
    description: 'Transform your image in oil painting style',
    thumbnail: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&w=800&q=80'
  }
];

// Mock transformation function (in a real app, this would call an API)
export const transformImage = async (
  imageUrl: string, 
  styleId: string
): Promise<string> => {
  // In a real application, this would call an API endpoint
  // Here we're just simulating a delay and returning the original image
  return new Promise((resolve) => {
    // Simulate API call delay
    setTimeout(() => {
      // For demo purposes, we're just adding a CSS filter to the image
      const canvas = document.createElement('canvas');
      const img = new Image();
      
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          toast.error('Failed to process image');
          resolve(imageUrl);
          return;
        }
        
        // Apply different filters based on style
        ctx.filter = getFilterForStyle(styleId);
        ctx.drawImage(img, 0, 0);
        
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      
      img.onerror = () => {
        toast.error('Failed to load image');
        resolve(imageUrl);
      };
      
      img.src = imageUrl;
    }, 2000);
  });
};

// Helper function to get CSS filter for style
const getFilterForStyle = (styleId: string): string => {
  switch (styleId) {
    case 'pixar':
      return 'saturate(1.5) contrast(1.2) brightness(1.1)';
    case 'anime':
      return 'saturate(1.8) contrast(1.4) brightness(1.1) hue-rotate(5deg)';
    case 'comic':
      return 'contrast(1.5) brightness(1.2) saturate(1.5)';
    case 'watercolor':
      return 'contrast(0.9) brightness(1.05) saturate(0.8) blur(0.5px)';
    case '3d':
      return 'contrast(1.2) brightness(1.1) saturate(1.3)';
    case 'mosaic':
      return 'contrast(1.15) saturate(1.1) brightness(1.05)';
    case 'sketch':
      return 'contrast(2) brightness(0.9) saturate(0) invert(0.02)';
    case 'oil':
      return 'contrast(1.15) saturate(1.3) brightness(1.05) sepia(0.2)';
    default:
      return '';
  }
};

// Save transformed image to local storage
export const saveTransformedImage = (
  original: string,
  transformed: string,
  styleId: string
): GalleryItem => {
  try {
    const style = toonStyles.find(s => s.id === styleId);
    const styleName = style?.name || 'Custom';
    
    const item: GalleryItem = {
      id: uuidv4(),
      original,
      transformed,
      styleName,
      timestamp: new Date().toISOString()
    };
    
    // Get existing gallery items from localStorage
    const existingItems = getGalleryItems();
    
    // Save updated gallery items
    localStorage.setItem('toonify-gallery', JSON.stringify([item, ...existingItems]));
    
    return item;
  } catch (error) {
    console.error('Failed to save image to gallery:', error);
    toast.error('Failed to save to gallery');
    throw error;
  }
};

// Get all gallery items from local storage
export const getGalleryItems = (): GalleryItem[] => {
  try {
    const items = localStorage.getItem('toonify-gallery');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Failed to get gallery items:', error);
    return [];
  }
};

// Download transformed image
export const downloadImage = (imageUrl: string, filename: string): void => {
  try {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'toonify-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Failed to download image:', error);
    toast.error('Failed to download image');
  }
};

// Delete gallery item
export const deleteGalleryItem = (itemId: string): void => {
  try {
    const existingItems = getGalleryItems();
    const updatedItems = existingItems.filter(item => item.id !== itemId);
    localStorage.setItem('toonify-gallery', JSON.stringify(updatedItems));
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    toast.error('Failed to delete from gallery');
  }
};
