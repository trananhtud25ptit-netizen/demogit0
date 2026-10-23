import type { Post } from '../types';

const STORAGE_KEY = 'miniblog_custom_posts';

export const getStoredPosts = (): Post[] => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) return [];
    return JSON.parse(rawData) as Post[];
  } catch {
    return [];
  }
};

export const saveNewPost = (title: string, body: string): Post => {
  const currentPosts = getStoredPosts();

  const newPost: Post = {
    userId: 1,
    id: Date.now(),
    title: title.trim(),
    body: body.trim(),
    isLocal: true,
    createdAt: new Date().toLocaleString('vi-VN'),
  };

  const updatedPosts = [newPost, ...currentPosts];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  return newPost;
};