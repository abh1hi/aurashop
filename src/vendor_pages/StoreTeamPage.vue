<template>
  <div class="page-container">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />

    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">west</span>
        Back to Dashboard
      </div>

      <header class="page-header">
        <h1 class="page-title">Team Management</h1>
      </header>

      <StoreTeamManager :storeId="storeId" />

    </main>

    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import StoreTeamManager from './components/StoreTeamManager.vue';

const router = useRouter();
const route = useRoute();
const storeId = computed(() => route.params.id as string);
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding-bottom: 80px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  position: relative;
  overflow-x: hidden;
}

.background-blobs {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 0;
}
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
}
.blob-1 { top: -10%; right: -10%; width: 500px; height: 500px; background: var(--primary-color); }
.blob-2 { bottom: 20%; left: -20%; width: 600px; height: 600px; background: var(--secondary-color); }

.main-content {
  position: relative;
  z-index: 1;
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: var(--spacing-md);
  font-weight: 500;
  transition: color 0.2s;
}
.back-link:hover { color: var(--primary-color); }

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}
.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Staff Grid */
.staff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.staff-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
}

.member-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.25rem;
}

.name { font-weight: 600; margin-bottom: 2px; }
.role-badge { 
  display: inline-block;
  font-size: 0.75rem; 
  padding: 2px 8px; 
  background: rgba(var(--primary-rgb), 0.1); 
  color: var(--primary-color); 
  border-radius: 12px;
  border: 1px solid rgba(var(--primary-rgb), 0.2);
  margin-bottom: 2px;
  text-transform: capitalize;
}
.email { font-size: 0.875rem; color: var(--text-secondary); }

.icon-btn.danger {
  color: var(--error-color);
  background: rgba(var(--error-rgb), 0.1);
  border: none;
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}
.icon-btn.danger:hover {
  background: rgba(var(--error-rgb), 0.2);
  transform: scale(1.05);
}

/* Applications */
.loading-state, .empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}
.empty-state .material-icons-round { font-size: 48px; opacity: 0.5; margin-bottom: var(--spacing-md); }

.application-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.app-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}

.app-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.applicant-info h4 { font-size: 1.1rem; margin-bottom: 4px; }
.applicant-info p { color: var(--text-secondary); margin-bottom: 4px; }
.role-requested { 
  font-size: 0.8rem; font-weight: 600; color: var(--primary-color); 
  background: rgba(var(--primary-rgb), 0.1); padding: 2px 6px; border-radius: 4px;
}
.app-date { font-size: 0.8rem; color: var(--text-tertiary); }

.app-body { margin-bottom: var(--spacing-md); }
.reason-box { background: rgba(0,0,0,0.2); padding: var(--spacing-sm); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm); font-style: italic; color: var(--text-secondary); }
.label { font-size: 0.75rem; font-weight: 600; display: block; margin-bottom: 4px; color: var(--text-tertiary); normal-style: normal; }
.contact-box { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); font-size: 0.9rem; }

.app-actions { display: flex; justify-content: flex-end; gap: var(--spacing-sm); }
</style>
