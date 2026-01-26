// API service để gọi backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
// 2. Tạo object chứa các function gọi API
export const studySessionAPI = {//tên đối tượng chứa các function
    // ============ GET ALL SESSIONS ============
    getAllSessions: async () => {//arrow function bất đồng bộ(chờ api trả về, chờ đợi mà k làm treo ứng dụng)
        // fetch() = gọi API (giống curl trong terminal)
        const response = await fetch(`${API_URL}/study-sessions`);
        // Kiểm tra response có OK không (status 200-299)
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách sessions');
        }
        // Chuyển response thành JSON
        return response.json();
    },
    // ============ CREATE SESSION ============
    createSession: async (sessionData) => {
        // sessionData = { duration: 25, breakTime: 5, count: 1, mode: "pomodoro" }
        const response = await fetch(`${API_URL}/study-sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //tell backend I sent json
            },
            body: JSON.stringify(sessionData),
        });
        if (!response.ok) {
            throw new Error('Lỗi khi tạo session');
        }
        return response.json();
    },
    // ============ GET STATISTICS ============
    getStats: async () => {
        const response = await fetch(`${API_URL}/study-sessions/stats`);

        if (!response.ok) {
            throw new Error('Lỗi khi lấy thống kê');
        }

        return response.json();
    },
    // ============ DELETE SESSION ============
    deleteSession: async (id) => {
        const response = await fetch(`${API_URL}/study-sessions/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Lỗi khi xóa session');
        }

        // DELETE trả về 204 No Content nên không có .json()
        return;
    }
};