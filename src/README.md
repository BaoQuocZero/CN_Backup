# Quản lý và Tối ưu hóa Giờ Giảng Dạy của Giảng Viên

Dự án này nhằm quản lý và tối ưu hóa giờ giảng dạy của giảng viên thông qua một ứng dụng web được xây dựng bằng React.js và Node.js. Phần backend sử dụng MySQL để lưu trữ dữ liệu.

## Bắt đầu

Hướng dẫn dưới đây sẽ giúp bạn sao chép dự án và chạy nó trên máy tính của bạn để phục vụ mục đích phát triển và kiểm thử.

### Yêu cầu cần thiết

Bạn cần cài đặt các phần mềm sau trên máy tính của mình:

- Node.js (phiên bản 18 trở lên)
- MySQL
- Git

### Cài đặt

1. **Clone kho lưu trữ:**
   ```bash
   git clone https://github.com/yourusername/managing-and-optimizing-faculty-teaching-hours.git
   cd managing-and-optimizing-faculty-teaching-hours
   ```

2. **Cài đặt các phụ thuộc cho backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Cài đặt các phụ thuộc cho frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Cấu hình môi trường cho backend:**
   Tạo tệp `.env` trong thư mục `backend` với nội dung sau:
   ```env
   # Cấu hình server
   PORT=8081
   URL_REACT=http://localhost:3000

   # Cấu hình cơ sở dữ liệu
   HOST_NAME=localhost  
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_NAME=faculty_management
   DB_PASSWORD=yourpassword

   # Cấu hình JWT
   SECRETKEYADMIN=your_secret_key
   ```

## Chạy Ứng dụng

1. **Backend**  
   Khởi động server backend:
   ```bash
   npm start
   ```

2. **Frontend**  
   Khởi động ứng dụng frontend:
   ```bash
   npm start
   ```

## 🚀 Giới thiệu về chúng tôi

Chúng tôi là nhà phát triển full-stack với đam mê xây dựng các ứng dụng tối ưu và hiệu quả.
