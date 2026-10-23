export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
  isLocal?: boolean;
  createdAt?: string;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
