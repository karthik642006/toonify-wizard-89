
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Follower } from '../../data/mockData';
import { useAuth } from "../../context/AuthContext";

interface FollowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followType: 'followers' | 'following';
  users: Follower[];
}

const FollowDialog = ({ open, onOpenChange, followType, users }: FollowDialogProps) => {
  const { isFollowing, followUser, unfollowUser } = useAuth();
  
  const handleFollowAction = (user: Follower) => {
    if (isFollowing(user.id)) {
      unfollowUser(user.id);
    } else {
      followUser(user.id, user.name, user.avatar);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{followType === 'followers' ? 'Followers' : 'Following'}</DialogTitle>
          <DialogDescription className="sr-only">List of {followType}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {users.length > 0 ? (
            users.map((user) => (
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
                {followType === 'followers' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      isFollowing(user.id) 
                        ? "border-toon-blue/50 text-toon-blue bg-toon-blue/10" 
                        : "border-toon-blue text-toon-blue"
                    )}
                    onClick={() => handleFollowAction(user)}
                  >
                    {isFollowing(user.id) ? 'Following' : 'Follow'}
                  </Button>
                )}
                {followType === 'following' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-toon-blue text-white"
                    onClick={() => unfollowUser(user.id)}
                  >
                    Unfollow
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No {followType} yet
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowDialog;
