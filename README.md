# Ứng dụng MiniBlog (React + TypeScript + Vite)

Dự án bài kiểm tra giữa kỳ: Xây dựng ứng dụng **MiniBlog** bằng **React + TypeScript (Vite)**, lấy dữ liệu từ REST API `https://jsonplaceholder.typicode.com` bằng `fetch`.

## 1. Các chức năng đã thực hiện
1. **Trang chủ (`/`)**:
   - Tải và hiển thị danh sách bài viết từ `GET /posts` kết hợp với các bài viết mới được người dùng tạo trong `localStorage`.
   - Tìm kiếm, lọc bài viết theo tiêu đề theo thời gian thực.
2. **Xem chi tiết bài viết & Bình luận (`/posts/:id`)**:
   - Gọi đồng thời chi tiết bài viết (`/posts/:id`) và danh sách bình luận (`/posts/:id/comments`) bằng `Promise.all`.
   - Hỗ trợ xem chi tiết đối với cả bài viết lưu trong `localStorage`.
3. **Trạng thái tải và Xử lý lỗi**:
   - Hiển thị spinner khi đang tải dữ liệu (`isLoading`) và thông báo lỗi khi request thất bại (`errorMsg`).
   - Sử dụng `AbortController` để tự động hủy request khi người dùng chuyển trang trước khi dữ liệu tải xong.
4. **Đăng nhập, Đăng xuất & Bảo vệ Route (`/login`)**:
   - Đăng nhập với tài khoản `admin` / `123456`, lưu trạng thái vào `localStorage`.
   - Component `ProtectedRoute` chặn người dùng chưa đăng nhập truy cập `/create` và ghi nhớ đường dẫn trước đó (`location.state.from`) để tự động chuyển hướng lại sau khi đăng nhập thành công.
5. **Form viết bài mới (`/create`)**:
   - Kiểm tra dữ liệu đầu vào theo từng trường: không để trống, tiêu đề từ 6–150 ký tự, nội dung tối thiểu 20 ký tự.
   - Bài viết mới được lưu vào `localStorage` và hiển thị đầu danh sách bài viết ở trang chủ.
6. **Trang 404 (`*`)**:
   - Hiển thị thông báo lỗi 404 kèm đường dẫn không tồn tại (`location.pathname`) và nút quay về trang chủ.

## 2. Cấu trúc thư mục dự án
```text
miniblog/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx           # Thanh điều hướng & nút Đăng nhập/Đăng xuất
│   │   └── ProtectedRoute.tsx   # Bảo vệ trang viết bài & nhớ trang trước khi đăng nhập
│   ├── context/
│   │   └── AuthContext.tsx      # Context quản lý trạng thái đăng nhập
│   ├── pages/
│   │   ├── Home.tsx             # Trang chủ: Danh sách bài viết & tìm kiếm tiêu đề
│   │   ├── PostDetail.tsx       # Trang chi tiết bài viết & bình luận
│   │   ├── CreatePost.tsx       # Form tạo bài viết mới + validate + lưu localStorage
│   │   ├── Login.tsx            # Trang đăng nhập (admin / 123456)
│   │   └── NotFound.tsx         # Trang 404 hiển thị đường dẫn sai
│   ├── utils/
│   │   └── localPosts.ts        # Hàm đọc/ghi bài viết từ localStorage
│   ├── types.ts                 # Khai báo kiểu dữ liệu Post, Comment
│   ├── App.tsx                  # Cấu hình định tuyến (Routes)
│   ├── App.css                  # CSS giao diện
│   └── main.tsx                 # Điểm khởi chạy ứng dụng
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts