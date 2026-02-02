# Tổng hợp thay đổi BE & FE (Session Login)

## Backend

### 1) Lưu session khi đăng nhập + endpoint logout/me
- Thêm `session.setAttribute("USER_ID", ...)` và `session.setAttribute("USERNAME", ...)`.
- Thêm `POST /api/auth/logout` và `GET /api/auth/me`.

File:
- [backend/src/main/java/org/devnqminh/studyfocus/controller/AuthController.java](backend/src/main/java/org/devnqminh/studyfocus/controller/AuthController.java)

### 2) LoginResponse có thêm userId
- Thêm field `userId` và constructor mới.

File:
- [backend/src/main/java/org/devnqminh/studyfocus/dto/response/authentication/LoginResponse.java](backend/src/main/java/org/devnqminh/studyfocus/dto/response/authentication/LoginResponse.java)

### 3) Trả userId trong login
- `new LoginResponse(token, user.getUsername(), user.getId())`.

File:
- [backend/src/main/java/org/devnqminh/studyfocus/service/Impl/authen/AuthServiceImpl.java](backend/src/main/java/org/devnqminh/studyfocus/service/Impl/authen/AuthServiceImpl.java)

### 4) Dùng session cho StudyTimeController
- Tạo `requireUserId(HttpSession session)` trả 401 nếu chưa login.
- Thay `userId = 1L` bằng `requireUserId(session)` ở tất cả endpoint.
- Sửa stats về `GET /api/study-sessions/stats`.
- Sửa thứ tự tham số `deleteSession(id, userId)`.

File:
- [backend/src/main/java/org/devnqminh/studyfocus/controller/StudyTimeController.java](backend/src/main/java/org/devnqminh/studyfocus/controller/StudyTimeController.java)

### 5) SecurityConfig cho phép gọi API
- Disable CSRF.
- `SessionCreationPolicy.IF_REQUIRED`.
- `permitAll` cho `/api/auth/**` và `anyRequest().permitAll()`.

File:
- [backend/src/main/java/org/devnqminh/studyfocus/security/SecurityConfig.java](backend/src/main/java/org/devnqminh/studyfocus/security/SecurityConfig.java)

---

## Frontend

### 1) Gửi cookie session khi gọi auth
- Thêm `credentials: 'include'`.
- Thêm hàm `logout()` và `me()`.

File:
- [frontend/src/api/authentication/auth.jsx](frontend/src/api/authentication/auth.jsx)

### 2) Gửi cookie session khi gọi study session
- Thêm `credentials: 'include'` cho GET/POST/DELETE/stats.

File:
- [frontend/src/api/studySession.js](frontend/src/api/studySession.js)

### 3) Bỏ lưu token trong login form
- Không lưu `localStorage.setItem('token', ...)` nữa.

File:
- [frontend/src/components/authentication/login/LoginForm.jsx](frontend/src/components/authentication/login/LoginForm.jsx)

---

## Cách test nhanh

1. POST `http://localhost:8080/api/auth/login`  
   Body JSON:
   ```json
   { "username": "testuser", "password": "123456" }
   ```

2. Dùng cùng cookie session:
    - GET `http://localhost:8080/api/study-sessions`
    - GET `http://localhost:8080/api/study-sessions/stats`