<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <div class="logo-wrap">
        <div class="logo-orb"></div>
        <span class="logo-text">Aura<span>Core</span></span>
      </div>
      <div class="header-actions">
        <button class="hide-btn desktop-only" @click="$emit('toggle-hide')">
            <span class="material-icons-round">chevron_left</span>
        </button>
        <button class="close-btn mobile-only" @click="$emit('close')">
            <span class="material-icons-round">close</span>
        </button>
      </div>
    </div>

    <!-- Tree View Navigation -->
    <div class="tree-view-container">
        <ul class="tree-view">
            <!-- General Section -->
            <li class="tree-item" :class="{ 'expanded': sections.general }">
                <div class="tree-content group-header" @click="toggleSection('general')">
                    <span class="tree-toggle material-icons-round">chevron_right</span>
                    <span class="tree-icon material-icons-round folder-icon">folder</span>
                    <span class="tree-label">General</span>
                </div>
                <ul class="tree-children">
                    <li class="tree-item" v-for="link in mainLinks" :key="link.path">
                        <router-link :to="link.path" class="tree-content-link" active-class="selected">
                            <span class="tree-toggle hidden"></span>
                            <span class="tree-icon material-icons-round file-icon">{{ link.icon }}</span>
                            <span class="tree-label">{{ link.name }}</span>
                        </router-link>
                    </li>
                </ul>
            </li>

            <!-- Management Section -->
            <li class="tree-item" :class="{ 'expanded': sections.management }">
                <div class="tree-content group-header" @click="toggleSection('management')">
                    <span class="tree-toggle material-icons-round">chevron_right</span>
                    <span class="tree-icon material-icons-round folder-icon">folder</span>
                    <span class="tree-label">Management</span>
                </div>
                <ul class="tree-children">
                    <li class="tree-item" v-for="link in managementLinks" :key="link.path">
                        <router-link :to="link.path" class="tree-content-link" active-class="selected">
                            <span class="tree-toggle hidden"></span>
                            <span class="tree-icon material-icons-round file-icon">{{ link.icon }}</span>
                            <span class="tree-label">{{ link.name }}</span>
                        </router-link>
                    </li>
                </ul>
            </li>
        </ul>
    </div>

    <div class="sidebar-footer">
      <div class="user-pill">
        <div class="user-avatar">AD</div>
        <div class="user-info">
          <span class="user-name">Admin</span>
          <span class="user-role">System Root</span>
        </div>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <span class="material-icons-round">power_settings_new</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../../composables/useAuth';

const router = useRouter();
const { logout } = useAuth();

const sections = ref({
    general: true,
    management: true
});

const toggleSection = (section: 'general' | 'management') => {
    sections.value[section] = !sections.value[section];
};

const mainLinks = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { name: 'Team', path: '/admin/team', icon: 'groups' },
];

const managementLinks = [
  { name: 'Users', path: '/admin/users', icon: 'person' },
  { name: 'Vendors', path: '/admin/vendors', icon: 'storefront' },
  { name: 'Stores', path: '/admin/stores', icon: 'corporate_fare' },
  { name: 'KYC Verification', path: '/admin/kyc', icon: 'verified_user' },
  { name: 'Settings', path: '/admin/settings', icon: 'settings' },
];

const handleLogout = async () => {
  if (confirm('Terminate admin session?')) {
    await logout();
    router.push('/login');
  }
};
</script>

<style scoped>
/* Tree View Container */
.tree-view-container {
    padding: var(--spacing-md);
    flex: 1;
    overflow-y: auto;
}

.tree-view {
    list-style: none;
    padding: 0;
    margin: 0;
}

.tree-item {
    margin: 2px 0;
}

/* Tree Content Row */
.tree-content, .tree-content-link {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--text-secondary);
    user-select: none;
    text-decoration: none;
    height: 40px;
}

.tree-content:hover, .tree-content-link:hover {
    background: var(--liquid-glass-shine-1);
    color: var(--text-primary);
}

.tree-content-link.selected {
    background: var(--primary-color);
    color: white;
    box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
}

/* Toggle Icon */
.tree-toggle {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    color: inherit;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.7;
}

.tree-item.expanded > .tree-content > .tree-toggle {
    transform: rotate(90deg);
}

.tree-toggle.hidden {
    visibility: hidden;
}

/* Item Icon */
.tree-icon {
    margin-right: var(--spacing-sm);
    font-size: 20px;
    color: inherit;
    opacity: 0.8;
}

.folder-icon {
    color: #fbc02d; /* Folder yellow */
    opacity: 1;
}

.file-icon {
    /* Inherit color */
}

/* Label */
.tree-label {
    font-size: 0.9rem;
    font-weight: 500;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* Nested List */
.tree-children {
    list-style: none;
    padding-left: 14px; /* Indentation */
    margin: 0;
    display: none;
    overflow: hidden;
    border-left: 1px solid var(--liquid-glass-border);
    margin-left: 11px; /* Align boarder with arrow center */
}

.tree-item.expanded > .tree-children {
    display: block;
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Sidebar Specifics */
.admin-sidebar {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--liquid-glass-base);
    backdrop-filter: blur(var(--liquid-blur));
    border-right: 1px solid var(--liquid-glass-border);
    color: var(--text-primary);
}

.sidebar-header {
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--liquid-glass-border);
}

.logo-wrap {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-orb {
    width: 32px;
    height: 32px;
    background: var(--primary-color);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4);
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.04em;
}

.logo-text span {
    color: var(--primary-color);
}

.hide-btn, .close-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--liquid-glass-border);
    background: var(--liquid-glass-shine-1);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}

.hide-btn:hover, .close-btn:hover {
    background: var(--text-primary);
    color: var(--bg-primary);
}

.mobile-only { display: none; }
.desktop-only { display: flex; }

@media (max-width: 1024px) {
    .mobile-only { display: flex; }
    .desktop-only { display: none; }
}

.sidebar-footer {
    padding: 20px;
    border-top: 1px solid var(--liquid-glass-border);
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(0,0,0,0.02);
}

.user-pill {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--liquid-glass-shine-1);
    padding: 8px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--liquid-glass-border);
}

.user-avatar {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    background: linear-gradient(135deg, #6366f1, #a855f7);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-size: 0.9rem;
    font-weight: 700;
}

.user-role {
    font-size: 0.75rem;
    color: var(--text-tertiary);
}

.logout-btn {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-lg);
    border: 1px solid var(--liquid-glass-border);
    background: rgba(255, 50, 50, 0.1);
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
}

.logout-btn:hover {
    background: #ef4444;
    color: white;
}
</style>

