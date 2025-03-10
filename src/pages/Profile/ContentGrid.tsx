
import { Play } from 'lucide-react';
import { Post } from '../../models/post';

interface ContentGridProps {
  posts: Post[];
  type: 'post' | 'video' | 'clip';
}

const ContentGrid = ({ posts, type }: ContentGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map(post => (
        <div key={post.id} className="aspect-square bg-gray-100 overflow-hidden rounded-sm relative">
          <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
          
          {(type === 'video' || type === 'clip') && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                {type === 'video' ? (
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[14px] border-l-white ml-1"></div>
                ) : (
                  <Play className="w-5 h-5 text-white fill-white" />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentGrid;
