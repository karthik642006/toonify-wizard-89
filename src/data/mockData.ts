
import { Post } from '../models/post';

export type FollowType = 'followers' | 'following';

export interface User {
  username: string;
  name: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followers: Follower[];
  following: Follower[];
}

export interface Follower {
  id: number;
  name: string;
  avatar: string | null;
}

// Mock user data
export const mockUsers: User[] = [
  {
    username: 'string',
    name: 'karthik',
    email: 'john@example.com',
    bio: 'UI/UX Designer | Developer | Content Creator',
    profilePicture: 'https://i.pravatar.cc/300?img=11',
    followers: [
      { id: 1, name: 'Alex Johnson', avatar: null },
      { id: 2, name: 'Maria Garcia', avatar: null },
      { id: 3, name: 'Tyler Wilson', avatar: null },
    ],
    following: [
      { id: 4, name: 'Emma Thompson', avatar: null },
      { id: 5, name: 'Carlos Rodriguez', avatar: null },
    ],
  },
  {
    username: 'creativecreator',
    name: 'Creative Creator',
    email: 'creator@example.com',
    bio: 'Content creator & Visual artist',
    profilePicture: 'https://i.pravatar.cc/150?img=32',
    followers: [
      { id: 1, name: 'Fan One', avatar: null },
      { id: 2, name: 'Fan Two', avatar: null },
    ],
    following: [
      { id: 4, name: 'Artist One', avatar: null },
    ],
  },
  {
    username: 'naturelover',
    name: 'Nature Lover',
    email: 'nature@example.com',
    bio: 'Exploring nature & wildlife photography',
    profilePicture: 'https://i.pravatar.cc/150?img=12',
    followers: [
      { id: 1, name: 'Earth Lover', avatar: null },
      { id: 2, name: 'Planet Saver', avatar: null },
    ],
    following: [
      { id: 4, name: 'Wild Explorer', avatar: null },
    ],
  },
  {
    username: 'oceanview',
    name: 'Ocean View',
    email: 'ocean@example.com',
    bio: 'Ocean photographer & Marine life enthusiast',
    profilePicture: 'https://i.pravatar.cc/150?img=39',
    followers: [
      { id: 1, name: 'Sea Lover', avatar: null },
      { id: 2, name: 'Wave Rider', avatar: null },
    ],
    following: [
      { id: 4, name: 'Marine Biologist', avatar: null },
    ],
  }
];

// Mock posts data with username and profileImage
export const mockPosts: Post[] = [
  { 
    id: '1', 
    imageUrl: 'https://i.pravatar.cc/300?img=1', 
    type: 'post', 
    createdAt: '2023-05-01', 
    likes: int;
    comments: string; 
    userId: '1',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11' 
  },
  { 
    id: '2', 
    imageUrl: 'https://i.pravatar.cc/300?img=2', 
    type: 'post', 
    createdAt: '2023-05-02', 
    likes: int; 
    comments: string; 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11'
  },
  { 
    id: '3', 
    imageUrl: 'https://i.pravatar.cc/300?img=3', 
    type: 'post', 
    createdAt: '2023-05-03', 
    likes: 210, 
    comments: 23, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11'
  },
  { 
    id: '4', 
    imageUrl: 'https://i.pravatar.cc/300?img=4', 
    type: 'post', 
    createdAt: '2023-05-04', 
    likes: 97, 
    comments: 9, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11'
  },
  { 
    id: '5', 
    imageUrl: 'https://i.pravatar.cc/300?img=5', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    type: 'video', 
    createdAt: '2023-05-05', 
    likes: 154, 
    comments: 19, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11'
  },
  { 
    id: '6', 
    imageUrl: 'https://i.pravatar.cc/300?img=6', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    type: 'video', 
    createdAt: '2023-05-06', 
    likes: 176, 
    comments: 21, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11'
  },
  { 
    id: '7', 
    imageUrl: 'https://i.pravatar.cc/300?img=7', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    type: 'clip', 
    createdAt: '2023-05-07', 
    likes: , 
    comments: 27, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11'
  },
  { 
    id: '8', 
    imageUrl: 'https://i.pravatar.cc/300?img=8', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    type: 'clip', 
    createdAt: '2023-05-08', 
    likes: 189, 
    comments: 16, 
    userId: 'johndoe',
    username: 'John Doe',
    profileImage: 'https://i.pravatar.cc/300?img=11'
  },
  // Posts for creativecreator
  { 
    id: '9', 
    imageUrl: 'https://i.pravatar.cc/300?img=10', 
    type: 'post', 
    createdAt: '2023-05-01', 
    likes: 320, 
    comments: 28, 
    userId: 'creativecreator',
    username: 'Creative Creator',
    profileImage: 'https://i.pravatar.cc/150?img=32'
  },
  { 
    id: '10', 
    imageUrl: 'https://i.pravatar.cc/300?img=12', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    type: 'video', 
    createdAt: '2023-05-02', 
    likes: 520, 
    comments: 42, 
    userId: 'creativecreator',
    username: 'Creative Creator',
    profileImage: 'https://i.pravatar.cc/150?img=32'
  },
  { 
    id: '11', 
    imageUrl: 'https://i.pravatar.cc/300?img=14', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    type: 'clip', 
    createdAt: '2023-05-03', 
    likes: 720, 
    comments: 58, 
    userId: 'creativecreator',
    username: 'Creative Creator',
    profileImage: 'https://i.pravatar.cc/150?img=32'
  },
  // Posts for naturelover
  { 
    id: '12', 
    imageUrl: 'https://i.pravatar.cc/300?img=20', 
    type: 'post', 
    createdAt: '2023-05-01', 
    likes: 220, 
    comments: 18, 
    userId: 'naturelover',
    username: 'Nature Lover',
    profileImage: 'https://i.pravatar.cc/150?img=12'
  },
  { 
    id: '13', 
    imageUrl: 'https://i.pravatar.cc/300?img=22', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    type: 'video', 
    createdAt: '2023-05-02', 
    likes: 420, 
    comments: 32, 
    userId: 'naturelover',
    username: 'Nature Lover',
    profileImage: 'https://i.pravatar.cc/150?img=12'
  },
  // Posts for oceanview
  { 
    id: '14', 
    imageUrl: 'https://i.pravatar.cc/300?img=30', 
    type: 'post', 
    createdAt: '2023-05-01', 
    likes: 250, 
    comments: 20, 
    userId: 'oceanview',
    username: 'Ocean View',
    profileImage: 'https://i.pravatar.cc/150?img=39'
  },
  { 
    id: '15', 
    imageUrl: 'https://i.pravatar.cc/300?img=32', 
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    type: 'clip', 
    createdAt: '2023-05-02', 
    likes: 450, 
    comments: 35, 
    userId: 'oceanview',
    username: 'Ocean View', 
    profileImage: 'https://i.pravatar.cc/150?img=39'
  },
];
