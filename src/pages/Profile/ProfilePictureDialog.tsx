
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import ImageUploader from '../../components/ImageUploader';

interface ProfilePictureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: string | null;
  onImageSelect: (file: File, preview: string) => void;
  onClearImage: () => void;
  onSave: () => void;
}

const ProfilePictureDialog = ({
  open,
  onOpenChange,
  selectedImage,
  onImageSelect,
  onClearImage,
  onSave
}: ProfilePictureDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Change Profile Picture</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <div className="flex justify-center mb-4">
            <div className="flex flex-col items-center gap-2 w-full">
              <ImageUploader 
                onImageSelect={onImageSelect} 
                selectedImage={selectedImage} 
                onClearImage={onClearImage} 
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-end mt-6">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-toon-blue hover:bg-toon-blue/90"
              onClick={onSave}
              disabled={!selectedImage}
            >
              <Check className="mr-2 h-4 w-4" />
              Save Picture
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfilePictureDialog;
