// =====================================================
// CampusIQ - Campus Intelligence & Analytics Platform
// © 2026 Disha Sen | disha0204sen@gmail.com
// =====================================================

const API_BASE = '/api';

// Auth utilities
const Auth = {
    getToken: () => localStorage.getItem('token'),
    getUser: () => JSON.parse(localStorage.getItem('user') || '{}'),
    isLoggedIn: () => !!localStorage.getItem('token'),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    },
    checkAuth: () => {
        if (!Auth.isLoggedIn()) {
            window.location.href = '/index.html';
            return false;
        }
        return true;
    }
};

// API utilities
const api = {
    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        const token = Auth.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                ...options,
                headers
            });
            
            if (response.status === 401) {
                Auth.logout();
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: 'Network error' };
        }
    },
    
    get: (endpoint) => api.request(endpoint),
    post: (endpoint, data) => api.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
    put: (endpoint, data) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (endpoint) => api.request(endpoint, { method: 'DELETE' })
};

// UI utilities
const UI = {
    showLoader: (container) => {
        container.innerHTML = '<div class="flex items-center justify-center" style="padding:3rem;"><div class="spinner"></div></div>';
    },
    
    showError: (container, message) => {
        container.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    },
    
    formatNumber: (num) => {
        return new Intl.NumberFormat().format(num);
    },
    
    formatPercent: (num) => {
        return `${parseFloat(num || 0).toFixed(1)}%`;
    },
    
    formatCurrency: (num) => {
        return `₹${parseFloat(num || 0).toFixed(2)} LPA`;
    },
    
    getBadgeClass: (value, type = 'risk') => {
        if (type === 'risk') {
            return value === 'High' ? 'badge-danger' : value === 'Medium' ? 'badge-warning' : 'badge-success';
        }
        if (type === 'attendance') {
            return value >= 75 ? 'badge-success' : value >= 60 ? 'badge-warning' : 'badge-danger';
        }
        return 'badge-info';
    },
    
    createTable: (data, columns, options = {}) => {
        if (!data || data.length === 0) {
            return '<p style="color:var(--text-muted);text-align:center;padding:2rem;">No data available</p>';
        }
        
        let html = '<div class="table-container"><table class="data-table"><thead><tr>';
        columns.forEach(col => {
            html += `<th>${col.label}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        data.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                let value = row[col.key];
                if (col.format) value = col.format(value, row);
                html += `<td>${value !== null && value !== undefined ? value : '-'}</td>`;
            });
            html += '</tr>';
        });
        
        html += '</tbody></table></div>';
        return html;
    }
};

// Dashboard initialization
function initDashboard() {
    if (!Auth.checkAuth()) return;
    
    const user = Auth.getUser();
    
    // Set user info in header
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    const userAvatarEl = document.getElementById('userAvatar');
    
    if (userNameEl) userNameEl.textContent = user.fullName || 'User';
    if (userRoleEl) userRoleEl.textContent = user.role?.replace('_', ' ').toUpperCase() || 'USER';
    if (userAvatarEl) userAvatarEl.textContent = (user.fullName || 'U').charAt(0).toUpperCase();
    
    // Add logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            Auth.logout();
        });
    }
}

// Export for global use
window.Auth = Auth;
window.api = api;
window.UI = UI;
window.initDashboard = initDashboard;
