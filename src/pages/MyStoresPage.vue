<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="dashboard-header">
        <div>
          <h1 class="page-title">My Stores</h1>
          <p class="page-subtitle">Manage your businesses</p>
        </div>
        <LiquidButton 
          text="New Store" 
          icon="add" 
          type="primary" 
          @click="createNewStore"
        />
      </div>

      <!-- Tabs -->
      <div class="tabs-container">
        <LiquidSegmentedControl 
          v-model="activeTab" 
          :options="['All', 'Active', 'Pending', 'Draft']" 
        />
      </div>

      <!-- Store List -->
      <div class="store-list" v-if="!loading">
        <div v-if="filteredStores.length === 0" class="empty-state">
          <span class="material-icons-round empty-icon">storefront</span>
          <h3>No stores found</h3>
          <p>You haven't created any stores in this category yet.</p>
        </div>

        <LiquidCard 
          v-for="store in filteredStores" 
          :key="store.id" 
          class="store-card"
          variant="glass"
        >
          <div class="card-header">
            <div class="store-info">
              <div class="store-icon">
                <img v-if="store.logoUrl" :src="store.logoUrl" alt="Store Logo" />
                <span v-else class="material-icons-round">store</span>
              </div>
              <div>
                <h3 class="store-name">{{ store.name || 'Untitled Store' }}</h3>
                <div class="store-meta">
                  <span class="status-badge" :class="store.status">{{ formatStatus(store.status) }}</span>
                  <span class="rating" v-if="store.rating">
                    <span class="material-icons-round star">star</span>
                    {{ store.rating }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="card-actions">
              <button class="action-btn" @click="handleEdit(store)">
                <span class="material-icons-round">dashboard</span>
              </button>
              <button class="action-btn" @click="handleSettings(store)">
                <span class="material-icons-round">settings</span>
              </button>
              <button class="action-btn delete" @click="handleDelete(store)">
                <span class="material-icons-round">delete</span>
              </button>
            </div>
          </div>

          <div class="card-footer">
            <div class="toggle-wrapper" v-if="store.status === 'active'">
              <label class="switch">
                <input type="checkbox" :checked="store.isActive" @change="toggleStatus(store)">
                <span class="slider round"></span>
              </label>
              <span class="toggle-label">{{ store.isActive ? 'Online' : 'Offline' }}</span>
            </div>
            <LiquidButton 
              v-if="store.status === 'draft'"
              text="Continue Setup" 
              type="ghost" 
              size="sm"
              @click="handleEdit(store)"
            />
             <LiquidButton 
              v-else
              text="View Dashboard" 
              type="ghost" 
              size="sm"
              @click="handleEdit(store)"
            />
          </div>
        </LiquidCard>
      </div>

      <div v-else class="loading-state">
        <div class="spinner"></div>
      </div>

    </main>
    
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidSegmentedControl from '../components/liquid-ui-kit/LiquidSegmentedControl/LiquidSegmentedControl.vue';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const router = useRouter();
const { fetchMyStores, deleteStore, toggleStoreStatus, createStore, subscribeToMyStores } = useVendor();
const { showToast } = useToast();

const stores = ref([]);
const loading = ref(true);
const activeTab = ref('All');
let unsubscribe = null;

onMounted(async () => {
  loading.value = true;
  unsubscribe = subscribeToMyStores((updatedStores) => {
    stores.value = updatedStores;
    loading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const filteredStores = computed(() => {
  if (activeTab.value === 'All') return stores.value;
  return stores.value.filter(s => s.status === activeTab.value.toLowerCase());
});

const formatStatus = (status) => {
  return status.replace('_', ' ').toUpperCase();
};

const createNewStore = async () => {
  // Create a draft store immediately and redirect
  try {
    const storeId = await createStore({ name: 'New Store' });
    router.push(`/vendor/store/${storeId}/onboarding`);
  } catch (e) {
    showToast('Error creating store', 'error');
  }
};

const handleEdit = (store) => {
  if (store.status === 'draft') {
    router.push(`/vendor/store/${store.id}/onboarding`);
  } else {
    router.push(`/vendor/store/${store.id}/dashboard`);
  }
};

const handleSettings = (store) => {
  router.push(`/vendor/store/${store.id}/settings`);
};

const handleDelete = async (store) => {
  if (!confirm('Are you sure you want to delete this store?')) return;
  try {
    await deleteStore(store.id);
    await loadStores();
    showToast('Store deleted', 'success');
  } catch (e) {
    showToast('Error deleting store', 'error');
  }
};

const toggleStatus = async (store) => {
  try {
    const newStatus = !store.isActive;
    await toggleStoreStatus(store.id, newStatus);
    store.isActive = newStatus; // Optimistic update
    showToast(`Store is now ${newStatus ? 'Online' : 'Offline'}`, 'success');
  } catch (e) {
    showToast('Error updating status', 'error');
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.main-content {
  flex: 1;
  padding: 20px;
  padding-bottom: 100px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-color);
}

.page-subtitle {
  color: var(--text-secondary);
}

.tabs-container {
  margin-bottom: 24px;
}

.store-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.store-card {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.store-info {
  display: flex;
  gap: 16px;
}

.store-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--secondary-pastel);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.store-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-icon span {
  font-size: 28px;
  color: var(--text-tertiary);
}

.store-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--text-color);
}

.store-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--glass-border);
  color: var(--text-secondary);
}

.status-badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.status-badge.draft { background: rgba(107, 114, 128, 0.1); color: #6b7280; }

.rating {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-color);
}

.star {
  font-size: 14px;
  color: #fbbf24;
  margin-right: 2px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn:hover {
  background: var(--glass-bg);
  color: var(--primary-text);
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--glass-border);
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toggle-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--text-disabled);
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
}

input:checked + .slider {
  background-color: var(--primary-pastel);
}

input:checked + .slider:before {
  transform: translateX(16px);
}

.slider.round {
  border-radius: 24px;
}

.slider.round:before {
  border-radius: 50%;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-icon {
  font-size: 64px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--glass-border);
  border-top-color: var(--primary-pastel);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
