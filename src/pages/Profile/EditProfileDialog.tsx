
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editName: string;
  setEditName: (name: string) => void;
  editEmail: string;
  setEditEmail: (email: string) => void;
  editBio: string;
  setEditBio: (bio: string) => void;
  onSave: () => void;
}

const EditProfileDialog = ({
  open,
  onOpenChange,
  editName,
  setEditName,
  editEmail,
  setEditEmail,
  editBio,
  setEditBio,
  onSave
}: EditProfileDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Edit Profile</span>
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
          <div className="space-y-4">
            <div>
              <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Input
                id="profileName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="profileEmail"
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            
            <div>
              <label htmlFor="profileBio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <Input
                id="profileBio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Tell us about yourself"
              />
            </div>
            
            <Button 
              className="w-full bg-toon-blue hover:bg-toon-blue/90"
              onClick={onSave}
            >
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
