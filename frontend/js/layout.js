// ════════════════════════════════════════════════════════
//  ACITY CONNECT — Layout Builder
//  Injects sidebar + topbar into any authenticated page
// ════════════════════════════════════════════════════════

function buildLayout(pageTitle) {
  const user = api.getUser();
  if (!user) return;

  const adminNavItems = `
    <span class="nav-section-label admin-only hidden">Admin</span>
    <button class="nav-link admin-only hidden" data-page="admin.html" onclick="navigate('admin.html')">
      <span>🛡️</span> Admin Panel
    </button>
  `;

  const sidebarHTML = `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <span class="logo-text">🏫 ACITY</span>
        <span class="logo-sub">Smart Campus Connect</span>
      </div>

      <nav class="sidebar-nav">
        <span class="nav-section-label">Main</span>
        <button class="nav-link" data-page="dashboard.html" onclick="navigate('dashboard.html')">
          <span>🏠</span> Dashboard
        </button>
        <button class="nav-link" data-page="listings.html" onclick="navigate('listings.html')">
          <span>🛒</span> Marketplace
        </button>
        <button class="nav-link" data-page="my-listings.html" onclick="navigate('my-listings.html')">
          <span>📋</span> My Listings
        </button>

        <span class="nav-section-label">Social</span>
        <button class="nav-link" data-page="interactions.html" onclick="navigate('interactions.html')">
          <span>🤝</span> Interactions
          <span class="badge" id="interactions-badge" style="display:none;"></span>
        </button>
        <button class="nav-link" data-page="messages.html" onclick="navigate('messages.html')">
          <span>💬</span> Messages
          <span class="badge" id="messages-badge" style="display:none;"></span>
        </button>
        <button class="nav-link notif-btn" data-page="notifications.html" onclick="navigate('notifications.html')">
          <span>🔔</span> Notifications
          <span class="badge notif-count" id="notif-badge" style="display:none;"></span>
        </button>

        <span class="nav-section-label">Account</span>
        <button class="nav-link" data-page="profile.html" onclick="navigate('profile.html')">
          <span>👤</span> My Profile
        </button>

        ${adminNavItems}

        <button class="nav-link" style="color:rgba(255,100,100,0.8); margin-top:8px;" onclick="api.logout()">
          <span>🚪</span> Sign Out
        </button>
      </nav>

      <div class="sidebar-user">
        <div class="user-info">
          <div class="avatar avatar-sm user-avatar"></div>
          <div>
            <div class="user-name">Loading...</div>
            <div class="user-role"></div>
          </div>
        </div>
      </div>
    </aside>
  `;

  const topbarHTML = `
    <div class="topbar">
      <div class="flex items-center gap-3">
        <button class="btn btn-ghost btn-icon" id="sidebar-toggle" onclick="toggleSidebar()" style="display:none;">
          ☰
        </button>
        <span class="topbar-title">${pageTitle}</span>
      </div>
      <div class="topbar-actions">
        <button class="btn btn-accent btn-sm" onclick="navigate('create-listing.html')">
          + New Listing
        </button>
        <button class="btn btn-ghost btn-icon" onclick="navigate('notifications.html')" title="Notifications">
          🔔
        </button>
      </div>
    </div>
  `;

  // Inject layout
  const app = document.getElementById('app');
  if (!app) return;

  const originalContent = app.innerHTML;
  app.innerHTML = `
    <div class="app-layout">
      ${sidebarHTML}
      <div class="main-content">
        ${topbarHTML}
        <div class="page-content">
          ${originalContent}
        </div>
      </div>
    </div>
  `;

  // Init sidebar user + notifications
  initSidebarUser();
  loadNotifCount();

  // Show admin nav if admin
  if (user.role === 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
  }

  // Mark active nav
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('active');
  });

  // Handle mobile sidebar toggle visibility
  if (window.innerWidth <= 900) {
    document.getElementById('sidebar-toggle').style.display = 'flex';
  }
}

function navigate(page) {
  window.location.href = page;
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

window.buildLayout = buildLayout;
window.navigate = navigate;
window.toggleSidebar = toggleSidebar;
