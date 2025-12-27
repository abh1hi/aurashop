<template>
  <nav class="admin-sidebar m3-surface" ref="navRef">
    <!-- Header -->
    <div class="sidebar-header">
      <div class="branding">
        <div class="logo-orb"></div>
        <span class="logo-text">Admin Panel</span>
      </div>
      <!-- Mobile Close Trigger -->
      <md-icon-button class="mobile-close-btn mobile-only" @click="$emit('close-mobile')">
        <md-icon>close</md-icon>
      </md-icon-button>
    </div>

    <div v-if="false" style="color: red; padding: 10px;">DEBUG: Collapsed={{ collapsed }}</div>

    <!-- Navigation Content -->
    <div class="nav-scroll-area">
      <ul class="nav-list">
         <!-- General Group -->
         <li class="nav-group-header" v-if="!collapsed">General</li>
         <li v-for="link in mainLinks" :key="link.path">
           <router-link :to="link.path" class="nav-item" :class="{ 'collapsed': collapsed }" active-class="active">
             <md-icon class="nav-icon">{{ link.icon }}</md-icon>
             <span class="nav-label" v-if="!collapsed">{{ link.name }}</span>
             <!-- Tooltip for collapsed state could go here -->
           </router-link>
         </li>

         <!-- Management Group -->
         <li class="nav-group-divider"></li>
         <li class="nav-group-header" v-if="!collapsed">Management</li>
         <li v-for="link in managementLinks" :key="link.path">
           <router-link :to="link.path" class="nav-item" :class="{ 'collapsed': collapsed }" active-class="active">
             <md-icon class="nav-icon">{{ link.icon }}</md-icon>
             <span class="nav-label" v-if="!collapsed">{{ link.name }}</span>
           </router-link>
         </li>
      </ul>
    </div>

    <!-- Footer / User -->
    <div class="sidebar-footer">
       <div class="user-profile" v-if="!collapsed">
          <div class="avatar">AD</div>
          <div class="user-info">
             <span class="name">Admin</span>
             <span class="role">Root</span>
          </div>
       </div>
       <md-icon-button @click="handleLogout" class="logout-btn" title="Logout">
          <md-icon>logout</md-icon>
       </md-icon-button>
       
       <!-- Collapse Toggle -->
       <md-icon-button @click="$emit('toggle-collapse')" class="collapse-btn desktop-only" title="Toggle Sidebar">
          <md-icon>{{ collapsed ? 'chevron_right' : 'chevron_left' }}</md-icon>
       </md-icon-button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '../../../composables/useAuth';
import { ref, onMounted, onUpdated } from 'vue'; // Import hooks

const props = defineProps<{
  collapsed: boolean
}>();

const emit = defineEmits(['close-mobile', 'toggle-collapse']);
const router = useRouter();
const { logout } = useAuth();
const navRef = ref<HTMLElement | null>(null); // Ref for the sidebar element

const logDetails = (trigger: string) => {
    if (!navRef.value) return;
    const rect = navRef.value.getBoundingClientRect();
    const style = window.getComputedStyle(navRef.value);
    console.log(`[Sidebar] ${trigger}`, {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        display: style.display,
        visibility: style.visibility,
        zIndex: style.zIndex,
        position: style.position,
        transform: style.transform
    });
};

onMounted(() => {
    console.log('[Sidebar] Mounted');
    logDetails('Initial Mount check');
    
    // Safety check loop for first 5 seconds
    let count = 0;
    const interval = setInterval(() => {
        count++;
        logDetails(`Poll #${count}`);
        if(count > 5) clearInterval(interval);
    }, 1000);
});

onUpdated(() => {
    logDetails('Updated');
});

const mainLinks = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { name: 'Team', path: '/admin/team', icon: 'groups' },
];

const managementLinks = [
  { name: 'Users', path: '/admin/users', icon: 'person' },
  { name: 'Vendors', path: '/admin/vendors', icon: 'storefront' },
  { name: 'Stores', path: '/admin/stores', icon: 'corporate_fare' },
  { name: 'KYC Review', path: '/admin/kyc', icon: 'verified_user' },
  { name: 'Notifications', path: '/admin/notifications', icon: 'notifications' },
  { name: 'Settings', path: '/admin/settings', icon: 'settings' },
];

const handleLogout = async () => {
  if(confirm('Logout?')) {
    await logout();
    router.push('/login');
  }
};
</script>

<style scoped>
.admin-sidebar {
    height: 100%;
    width: 100%; /* Force fill */
    display: flex;
    flex-direction: column;
    background: var(--md-sys-color-surface, #ffffff); /* Fallback to white */
    color: var(--md-sys-color-on-surface, #000000); /* Fallback to black */
    border-right: 1px solid var(--md-sys-color-outline-variant, #e0e0e0);
    overflow: hidden;
    transition: width 0.3s ease;
}

/* Header */
.sidebar-header {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    flex-shrink: 0;
    background: var(--md-sys-color-surface, #fff); /* Safety */
}

.branding {
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
}

.logo-orb {
    width: 32px;
    height: 32px;
    background: var(--md-sys-color-primary);
    border-radius: 50%;
}

.logo-text {
    font-size: 1.1rem;
    font-weight: 500;
    color: var(--md-sys-color-on-surface);
}

.mobile-only { display: none; }
@media(max-width: 1024px) {
    .mobile-only { display: block; }
}

/* Nav List */
.nav-scroll-area {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
}

.nav-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.nav-group-header {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    padding: 8px 16px;
    margin-top: 8px;
    text-transform: uppercase;
}

.nav-group-divider {
    height: 1px;
    background: var(--md-sys-color-outline-variant);
    margin: 8px 0;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 28px;
    color: var(--md-sys-color-on-surface-variant);
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
    overflow: hidden;
}

.nav-item:hover {
    background: var(--md-sys-color-surface-container-high);
    color: var(--md-sys-color-on-surface);
}

.nav-item.active {
    background: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
}

/* Collapsed State Adjustment */
.nav-item.collapsed {
    padding: 12px;
    justify-content: center;
}

.nav-icon {
    font-size: 24px;
}

/* Footer */
.sidebar-footer {
    padding: 16px;
    border-top: 1px solid var(--md-sys-color-outline-variant);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
}

.avatar {
    width: 32px;
    height: 32px;
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.8rem;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.name { font-size: 0.85rem; font-weight: 500; }
.role { font-size: 0.7rem; color: var(--md-sys-color-on-surface-variant); }

.logout-btn {
    color: var(--md-sys-color-error);
}

.collapse-btn {
    color: var(--md-sys-color-on-surface-variant);
    margin-left: auto; /* Push to right if space permits, or just auto spacing */
}

/* Hide collapse button on mobile since overlay logic handles close */
@media(max-width: 768px) {
    .collapse-btn { display: none; }
}
</style>
