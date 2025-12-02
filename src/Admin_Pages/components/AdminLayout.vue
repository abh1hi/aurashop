<template>
  <div class="admin-layout">
    <div class="sidebar-wrapper" :class="{ 'open': isSidebarOpen }">
      <AdminSidebar @close="closeSidebar" />
    </div>
    
    <div class="mobile-overlay" v-if="isSidebarOpen" @click="closeSidebar"></div>
    
    <main class="main-content">
      <AdminTopBar @toggle-sidebar="toggleSidebar" />
      <slot></slot>
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
