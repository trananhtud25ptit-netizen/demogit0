import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  // Đọc lại trang trước đó do ProtectedRoute truyền sang (nếu có)
  const fromPath = (location.state as { from?: string })?.from || '/';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!username.trim() || !password.trim()) {
      setLoginError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
      return;
    }

    const isSuccess = login(username.trim(), password);
    if (isSuccess) {
      navigate(fromPath, { replace: true });
    } else {
      setLoginError('Sai thông tin! Vui lòng sử dụng tài khoản: admin / 123456');
    }
  };

  return (
    <div className="page-container auth-page">
      <div className="form-card">
        <h2>Đăng nhập hệ thống</h2>
        <p className="form-subtitle">
          Bạn cần đăng nhập để truy cập chức năng viết bài mới.
        </p>

        {loginError && <div className="form-alert">{loginError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              placeholder="Nhập admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              placeholder="Nhập 123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary full-width">
            Đăng nhập
          </button>
        </form>

        <div className="account-hint">
          <span>Tài khoản mẫu:</span> <code>admin</code> / <code>123456</code>
        </div>
      </div>
    </div>
  );
}