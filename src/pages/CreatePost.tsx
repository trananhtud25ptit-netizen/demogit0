import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveNewPost } from '../utils/localPosts';

interface ValidationErrors {
  title?: string;
  body?: string;
}

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Tiêu đề bài viết không được để trống.';
    } else if (trimmedTitle.length < 6) {
      newErrors.title = 'Tiêu đề phải có tối thiểu 6 ký tự.';
    } else if (trimmedTitle.length > 150) {
      newErrors.title = 'Tiêu đề không được vượt quá 150 ký tự.';
    }

    if (!trimmedBody) {
      newErrors.body = 'Nội dung bài viết không được để trống.';
    } else if (trimmedBody.length < 20) {
      newErrors.body = `Nội dung cần ít nhất 20 ký tự (hiện tại: ${trimmedBody.length} ký tự).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreatePost = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    saveNewPost(title, body);
    navigate('/');
  };

  return (
    <div className="page-container narrow-container">
      <div className="form-card create-post-card">
        <h2>Đăng bài viết mới</h2>
        <p className="form-subtitle">
          Bài viết sau khi tạo sẽ được lưu vào <code>localStorage</code> và hiển thị ở đầu trang chủ.
        </p>

        <form onSubmit={handleCreatePost} noValidate>
          <div className="form-group">
            <label htmlFor="post-title">Tiêu đề bài viết *</label>
            <input
              id="post-title"
              type="text"
              placeholder="Nhập tiêu đề bài viết (tối thiểu 6 ký tự)..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              className={errors.title ? 'input-invalid' : ''}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="post-body">Nội dung chi tiết *</label>
            <textarea
              id="post-body"
              rows={7}
              placeholder="Viết nội dung bài chia sẻ của bạn tại đây (tối thiểu 20 ký tự)..."
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (errors.body) setErrors({ ...errors, body: undefined });
              }}
              className={errors.body ? 'input-invalid' : ''}
            />
            {errors.body && <span className="field-error">{errors.body}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate('/')}
            >
              Hủy bỏ
            </button>
            <button type="submit" className="btn-primary">
              Xuất bản bài viết
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}