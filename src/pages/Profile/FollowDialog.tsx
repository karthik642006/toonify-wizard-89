
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Follower } from '../../data/mockData';

interface FollowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followType: 'followers' | 'following';
  users: Follower[];
}

const FollowDialog = ({ open, onOpenChange, followType, users }: FollowDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{followType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {users.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
              <Avatar className="h-10 w-10">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-toon-blue/10">
                    <UserRound className="w-5 h-5 text-toon-blue" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-grow">
                <p className="font-medium">{user.name}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  followType === 'followers' ? "border-toon-blue text-toon-blue" : "bg-toon-blue text-white"
                )}
              >
                {followType === 'followers' ? 'Follow' : 'Following'}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialog;
