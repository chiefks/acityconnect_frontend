// ════════════════════════════════════════════════════════
//  ACITY CONNECT — API Utility
//  Centralizes all backend calls with auth header handling
// ════════════════════════════════════════════════════════

const API_BASE = 'https://acityconnect-backend.onrender.com/api';
// For local dev, change to: const API_BASE = 'http://localhost:5000/api';

const api = {
  // ── Token Management ───────────────────────────────────
  getToken() {
    return localStorage.getItem('acity_token');
  },

  setToken(token) {
    localStorage.setItem('acity_token', token);
  },

  removeToken() {
    localStorage.removeItem('acity_token');
    localStorage.removeItem('acity_user');
  },

  getUser() {
    const u = localStorage.getItem('acity_user');
    return u ? JSON.parse(u) : null;
  },

  setUser(user) {
    localStorage.setItem('acity_user', JSON.stringify(user));
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  // ── Core Fetch ─────────────────────────────────────────
  async request(method, endpoint, body = null, requireAuth = true) {
    const headers = { 'Content-Type': 'application/json' };

    if (requireAuth) {
      const token = this.getToken();
      if (!token) {
        window.location.href = '/pages/login.html';
        return;
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await res.json();

      if (res.status === 401) {
        this.removeToken();
        window.location.href = '/pages/login.html';
        return;
      }

      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      console.error(`API Error [${method} ${endpoint}]:`, err);
      return { ok: false, status: 0, data: { message: 'Network error. Please check your connection.' } };
    }
  },

  get:    (url, auth = true)       => api.request('GET',    url, null, auth),
  post:   (url, body, auth = true) => api.request('POST',   url, body, auth),
  put:    (url, body, auth = true) => api.request('PUT',    url, body, auth),
  delete: (url, auth = true)       => api.request('DELETE', url, null, auth),

  // ── Auth ───────────────────────────────────────────────
  async login(email, password) {
    const res = await this.post('/auth/login', { email, password }, false);
    if (res.ok) {
      this.setToken(res.data.token);
      this.setUser(res.data.user);
    }
    return res;
  },

  async register(data) {
    const res = await this.post('/auth/register', data, false);
    if (res.ok) {
      this.setToken(res.data.token);
      this.setUser(res.data.user);
    }
    return res;
  },

  logout() {
    this.removeToken();
    window.location.href = '/pages/login.html';
  },

  // ── Listings ────────────────────────────────────────────
  getListings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/listings?${query}`, false);
  },
  getListing:   (id)  => api.get(`/listings/${id}`, false),
  getMyListings: ()   => api.get('/listings/my'),
  createListing: (d)  => api.post('/listings', d),
  updateListing: (id, d) => api.put(`/listings/${id}`, d),
  deleteListing: (id) => api.delete(`/listings/${id}`),

  // ── Interactions ────────────────────────────────────────
  expressInterest: (listing_id, message) => api.post('/interactions', { listing_id, message }),
  getMyInteractions: () => api.get('/interactions/my'),
  updateInteraction: (id, status) => api.put(`/interactions/${id}`, { status }),
  getListingInterests: (listingId) => api.get(`/interactions/listing/${listingId}`),

  // ── Messages ─────────────────────────────────────────────
  getConversations: () => api.get('/messages/conversations'),
  getMessages:      (userId) => api.get(`/messages/${userId}`),
  sendMessage:      (receiver_id, content, interaction_id) =>
    api.post('/messages', { receiver_id, content, interaction_id }),

  // ── Notifications ─────────────────────────────────────────
  getNotifications:   () => api.get('/notifications'),
  markAllRead:        () => api.put('/notifications/read-all', {}),
  markOneRead:        (id) => api.put(`/notifications/${id}/read`, {}),

  // ── Profile ───────────────────────────────────────────────
  getProfile:   (id)  => api.get(`/users/${id}`),
  updateProfile: (d)  => api.put('/users/profile', d),
  getUserListings: (id) => api.get(`/users/${id}/listings`),

  // ── Admin ─────────────────────────────────────────────────
  adminStats: ()           => api.get('/admin/stats'),
  adminGetListings: (status) => api.get(`/admin/listings?status=${status}`),
  adminApprove: (id)       => api.put(`/admin/listings/${id}/approve`, {}),
  adminReject:  (id, reason) => api.put(`/admin/listings/${id}/reject`, { reason }),
  adminDeleteListing: (id) => api.delete(`/admin/listings/${id}`),
  adminGetUsers: ()        => api.get('/admin/users'),
  adminDeactivate: (id)    => api.put(`/admin/users/${id}/deactivate`, {}),
  adminActivate:   (id)    => api.put(`/admin/users/${id}/activate`, {}),
};

// ── Utility Functions ──────────────────────────────────────
function showAlert(container, type, message) {
  const icons = { success: '✅', danger: '❌', warning: '⚠️', info: 'ℹ️' };
  const el = document.createElement('div');
  el.className = `alert alert-${type} animate-fade-in`;
  el.innerHTML = `<span>${icons[type] || ''}</span> <span>${message}</span>`;
  container.innerHTML = '';
  container.appendChild(el);
  if (type === 'success') setTimeout(() => el.remove(), 4000);
}

function avatarInitials(name = '') {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function formatPrice(price) {
  if (!price) return 'Free / Exchange';
  return `GH₵ ${parseFloat(price).toFixed(2)}`;
}

function getCategoryEmoji(category, title = '') {
  if (category === 'skill') return '🧠';
  const t = title.toLowerCase();
  if (t.includes('book') || t.includes('text')) return '📚';
  if (t.includes('laptop') || t.includes('computer')) return '💻';
  if (t.includes('phone')) return '📱';
  if (t.includes('cloth') || t.includes('shirt')) return '👕';
  if (t.includes('chair') || t.includes('furniture')) return '🪑';
  return '📦';
}

function requireAuth() {
  if (!api.isLoggedIn()) {
    window.location.href = '/pages/login.html';
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!api.isAdmin()) {
    window.location.href = '/pages/dashboard.html';
    return false;
  }
  return true;
}

// Render sidebar user info
function initSidebarUser() {
  const user = api.getUser();
  if (!user) return;

  const nameEl = document.querySelector('.sidebar-user .user-name');
  const roleEl = document.querySelector('.sidebar-user .user-role');
  const avatarEl = document.querySelector('.sidebar-user .user-avatar');

  if (nameEl) nameEl.textContent = user.full_name;
  if (roleEl) roleEl.textContent = user.role === 'admin' ? 'Administrator' : user.department || 'Student';
  if (avatarEl) {
    avatarEl.textContent = avatarInitials(user.full_name);
  }

  // Show admin nav if admin
  if (user.role === 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
  }

  // Mark active nav link
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });
}

// Load notification count
async function loadNotifCount() {
  if (!api.isLoggedIn()) return;
  const res = await api.getNotifications();
  if (res && res.ok) {
    const count = res.data.unread_count;
    const badge = document.querySelector('.notif-count');
    const dot   = document.querySelector('.notif-dot');
    if (badge) badge.textContent = count > 0 ? count : '';
    if (dot) dot.style.display = count > 0 ? 'block' : 'none';
  }
}

// Export to global
window.api = api;
window.showAlert = showAlert;
window.avatarInitials = avatarInitials;
window.timeAgo = timeAgo;
window.formatPrice = formatPrice;
window.getCategoryEmoji = getCategoryEmoji;
window.requireAuth = requireAuth;
window.requireAdmin = requireAdmin;
window.initSidebarUser = initSidebarUser;
window.loadNotifCount = loadNotifCount;
