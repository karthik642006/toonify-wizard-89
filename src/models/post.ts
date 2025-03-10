
export interface Post {
  id: string;
  imageUrl: string;
  type: 'post' | 'video' | 'clip';
  createdAt: string;
  likes: number;
  comments: number;
  userId: string;
  username?: string;
  profileImage?: string;
}
