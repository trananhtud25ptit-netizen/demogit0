import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { getStoredPosts } from '../utils/localPosts';

export default function Home() {
  const [apiPosts, setApiPosts] = useState<Post[]>([]);
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLocalPosts(getStoredPosts());
    const controller = new AbortController();

    const fetchPosts = async () => {
      setIsLoading(true);
      setErrorMsg(null);

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Không thể tải danh sách bài viết (Mã lỗi: ${response.status})`);
        }

        const data: Post[] = await response.json();
        setApiPosts(data);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setErrorMsg(err.message || 'Đã xảy ra lỗi kết nối mạng khi tải bài viết.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, []);

  const combinedPosts = useMemo(() => {
    return [...localPosts, ...apiPosts];
  }, [localPosts, apiPosts]);

  const filteredPosts = useMemo(() => {
    const cleanQuery = keyword.trim().toLowerCase();
    if (!cleanQuery) return combinedPosts;
    return combinedPosts.filter((post) =>
      post.title.toLowerCase().includes(cleanQuery)
    );
  }, [combinedPosts, keyword]);

  return (
    <div className="page-container">
      <section className="search-banner">
        <h1>Danh sách bài viết</h1>
        <p>Khám phá các bài viết từ cộng đồng hoặc chia sẻ góc nhìn của bạn</p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Nhập từ khóa để tìm kiếm theo tiêu đề bài viết..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button
              type="button"
              className="clear-btn"
              onClick={() => setKeyword('')}
            >
              Xóa
            </button>
          )}
        </div>
      </section>

      {isLoading && (
        <div className="status-box loading-state">
          <div className="spinner"></div>
          <span>Đang tải danh sách bài viết từ máy chủ...</span>
        </div>
      )}

      {errorMsg && (
        <div className="status-box error-state">
          <strong>Lỗi tải dữ liệu:</strong> {errorMsg}
        </div>
      )}

      {!isLoading && !errorMsg && (
        <>
          <div className="result-meta">
            Hiển thị <strong>{filteredPosts.length}</strong> bài viết
            {keyword.trim() ? ` khớp với từ khóa "${keyword}"` : ''}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="empty-result">
              Không tìm thấy bài viết nào có tiêu đề chứa <strong>"{keyword}"</strong>.
            </div>
          ) : (
            <div className="posts-grid">
              {filteredPosts.map((post) => (
                <article key={post.id} className="post-card">
                  <div className="card-top">
                    <span className={post.isLocal ? 'tag tag-local' : 'tag tag-api'}>
                      {post.isLocal ? 'Bài viết mới' : `Bài #${post.id}`}
                    </span>
                    {post.createdAt && (
                      <span className="post-date">{post.createdAt}</span>
                    )}
                  </div>

                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-excerpt">
                    {post.body.length > 110
                      ? `${post.body.slice(0, 110)}...`
                      : post.body}
                  </p>

                  <div className="card-footer">
                    <Link to={`/posts/${post.id}`} className="read-more-link">
                      Xem chi tiết & bình luận &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}