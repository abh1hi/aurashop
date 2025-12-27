<template>
  <div class="admin-shell" :class="{ 'collapsed': isCollapsed, 'mobile-active': isMobileOpen }">
    <!-- Sidebar Area -->
    <aside class="shell-sidebar" :class="{ 'mobile-open': isMobileOpen }">
      <div class="sidebar-container">
        <AdminSidebar :collapsed="isCollapsed" @close-mobile="closeMobileSidebar" />
      </div>
    </aside>

    <!-- Overlay for Mobile -->
    <div class="shell-overlay" :class="{ 'visible': isMobileOpen }" @click="closeMobileSidebar"></div>

    <!-- Main Content Area -->
    <div class="shell-main">
      <AdminTopBar @toggle-sidebar="toggleSidebar" />
      
      <main class="shell-viewport">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminSidebar from '../Dashboard/components/AdminSidebar.vue';
import AdminTopBar from '../Dashboard/components/AdminTopBar.vue';

const isCollapsed = ref(false);
const isMobileOpen = ref(false);

const toggleSidebar = () => {
    console.log('[Layout] Toggle Sidebar. Window Width:', window.innerWidth);
    if (window.innerWidth > 768) {
        isCollapsed.value = !isCollapsed.value;
        console.log('[Layout] Desktop State:', isCollapsed.value ? 'Collapsed' : 'Expanded');
    } else {
        isMobileOpen.value = !isMobileOpen.value;
        console.log('[Layout] Mobile State:', isMobileOpen.value ? 'Open' : 'Closed');
    }
};

const closeMobileSidebar = () => {
    isMobileOpen.value = false;
};
</script>

<style scoped>
/* 
  Flex Layout Logic (More robust than Grid here)
  - Desktop: [Sidebar (Fixed Width)] [Main (Flex-1)]
  - Mobile: [Sidebar (Absolute)] [Main (Full Width)]
*/

.admin-shell {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100%;
    background-color: var(--md-sys-color-background, #fdfdfd);
    color: var(--md-sys-color-on-background, #1a1b1f);
    overflow: hidden;
}

/* Sidebar Wrapper */
.shell-sidebar {
    width: 280px;
    height: 100%;
    flex-shrink: 0; /* Never shrink below 280px */
    background: var(--md-sys-color-surface);
    border-right: 1px solid var(--md-sys-color-outline-variant);
    z-index: 50;
    position: relative;
    transition: width 0.3s ease;
}

/* Desktop Collapsed */
.admin-shell.collapsed .shell-sidebar {
    width: 80px;
}

.sidebar-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

/* Main Content */
.shell-main {
    flex: 1; /* Take remaining space */
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 0; /* Prevent flex overflow */
    position: relative;
    z-index: 1;
    background: transparent;
}

.shell-viewport {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    max-width: 1600px;
    width: 100%;
    margin: 0 auto;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .shell-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: 280px;
        transform: translateX(-100%);
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        box-shadow: 4px 0 24px rgba(0,0,0,0.15);
        display: block; 
    }

    .shell-sidebar.mobile-open {
        transform: translateX(0) !important;
    }

    /* Overlay */
    .shell-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 900;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }

    .shell-overlay.visible {
        opacity: 1;
        pointer-events: auto;
    }
}
</style>
