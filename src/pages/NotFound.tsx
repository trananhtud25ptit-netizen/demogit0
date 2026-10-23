import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  return (
    <div className="page-container notfound-box">
      <div className="error-code">404</div>
      <h2>Không tìm thấy trang yêu cầu</h2>
      <p>
        Đường dẫn <code>{location.pathname}</code> không tồn tại trên hệ thống MiniBlog.
      </p>
      <Link to="/" className="btn-primary">
        Về trang chủ MiniBlog
      </Link>
    </div>
  );
}
