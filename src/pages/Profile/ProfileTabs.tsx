
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post } from '../../models/post';
import ContentGrid from './ContentGrid';

interface ProfileTabsProps {
  posts: Post[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const ProfileTabs = ({ posts, activeTab, setActiveTab }: ProfileTabsProps) => {
  const getFilteredContent = (type: 'post' | 'video' | 'clip') => {
    return posts.filter(post => post.type === type);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Tabs defaultValue="posts" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-4">
          <ContentGrid posts={getFilteredContent('post')} type="post" />
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4">
          <ContentGrid posts={getFilteredContent('video')} type="video" />
        </TabsContent>
        
        <TabsContent value="clips" className="mt-4">
          <ContentGrid posts={getFilteredContent('clip')} type="clip" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
