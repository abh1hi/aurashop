<template>
  <div class="admin-layout">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="sidebar-wrapper" :class="{ 'open': isSidebarOpen, 'hidden': isSidebarHidden }">
      <AdminSidebar @close="closeSidebar" @toggle-hide="toggleSidebarHide" />
    </div>
    
    <div class="sidebar-toggle-trigger" v-if="isSidebarHidden" @click="toggleSidebarHide">
        <span class="material-icons-round">chevron_right</span>
    </div>
    
    <div class="mobile-overlay" v-if="isSidebarOpen" @click="closeSidebar"></div>
    
    <main class="main-content" :class="{ 'expanded': isSidebarHidden }">
      <AdminTopBar @toggle-sidebar="toggleSidebar" />
      <div class="page-viewport">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AdminSidebar from '../Dashboard/components/AdminSidebar.vue';
import AdminTopBar from '../Dashboard/components/AdminTopBar.vue';

const route = useRoute();
const isSidebarOpen = ref(false);
const isSidebarHidden = ref(false); // Desktop only state

const toggleSidebarHide = () => {
    isSidebarHidden.value = !isSidebarHidden.value;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// Close sidebar on route change (mobile)
watch(
  () => route.path,
  () => {
    closeSidebar();
  }
);
</script>

<style scoped src="./AdminLayout.css"></style>
