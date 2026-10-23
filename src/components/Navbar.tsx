import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="top-nav">
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">
          MiniBlog<span>.ts</span>
        </Link>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? 'active-link' : ''
            }
          >
            Trang chủ
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }: { isActive: boolean }) =>
              isActive ? 'active-link' : ''
            }
          >
            + Viết bài mới
          </NavLink>
        </nav>

        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span className="user-badge">
                Xin chào, <strong>{user}</strong>
              </span>
              <button onClick={handleLogout} className="btn-outline">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}