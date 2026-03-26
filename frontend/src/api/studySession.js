// API service để gọi backend
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const studySessionAPI = {
    getAllSessions: async () => {
        const response = await fetch(`${API_URL}/study-sessions`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Lỗi khi lấy danh sách sessions');
        }
        return response.json();
    },

    createSession: async (sessionData) => {
        const response = await fetch(`${API_URL}/study-sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(sessionData),
        });
        if (!response.ok) {
            throw new Error('Lỗi khi tạo session');
        }
        return response.json();
    },

    getStats: async () => {
        const response = await fetch(`${API_URL}/study-sessions/stats`, {
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Lỗi khi lấy thống kê');
        }
        return response.json(); 
    },
    
    deleteSession: async (id) => {
        const response = await fetch(`${API_URL}/study-sessions/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Lỗi khi xóa session');
        }
        return;
    }
};