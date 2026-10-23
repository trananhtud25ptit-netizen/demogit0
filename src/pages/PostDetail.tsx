import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Post, Comment } from '../types';
import { getStoredPosts } from '../utils/localPosts';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const postId = Number(id);
    const localMatch = getStoredPosts().find((item) => item.id === postId);

    if (localMatch) {
      setPost(localMatch);
      setComments([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchDetailAndComments = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const [postRes, commentsRes] = await Promise.all([
          fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
            signal: controller.signal,
          }),
          fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`, {
            signal: controller.signal,
          }),
        ]);

        if (!postRes.ok) {
          throw new Error('Không tìm thấy bài viết này hoặc bài viết đã bị xóa.');
        }

        if (!commentsRes.ok) {
          throw new Error('Không thể tải danh sách bình luận.');
        }

        const postData: Post = await postRes.json();
        const commentsData: Comment[] = await commentsRes.json();

        setPost(postData);
        setComments(commentsData);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setErrorMsg(err.message || 'Có lỗi xảy ra khi tải chi tiết bài viết.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchDetailAndComments();
    return () => controller.abort();
  }, [id]);

  return (
    <div className="page-container narrow-container">
      <div className="back-nav">
        <Link to="/" className="back-link">
          &larr; Quay lại danh sách bài viết
        </Link>
      </div>

      {isLoading && (
        <div className="status-box loading-state">
          <div className="spinner"></div>
          <span>Đang tải nội dung bài viết và bình luận...</span>
        </div>
      )}

      {errorMsg && (
        <div className="status-box error-state">
          <strong>Thông báo lỗi:</strong> {errorMsg}
        </div>
      )}

      {!isLoading && !errorMsg && post && (
        <>
          <article className="detail-article">
            <div className="detail-meta">
              <span className={post.isLocal ? 'tag tag-local' : 'tag tag-api'}>
                {post.isLocal ? 'Bài viết cá nhân (LocalStorage)' : `Mã bài viết #${post.id}`}
              </span>
              {post.createdAt && <span>Đăng lúc: {post.createdAt}</span>}
            </div>

            <h1 className="detail-title">{post.title}</h1>
            <div className="detail-body">{post.body}</div>
          </article>

          <section className="comments-wrapper">
            <h3>Bình luận ({comments.length})</h3>

            {comments.length === 0 ? (
              <p className="no-comments">Chưa có bình luận nào cho bài viết này.</p>
            ) : (
              <div className="comments-list">
                {comments.map((item) => (
                  <div key={item.id} className="comment-card">
                    <div className="comment-header">
                      <strong className="comment-author">{item.name}</strong>
                      <span className="comment-email">{item.email}</span>
                    </div>
                    <p className="comment-content">{item.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}