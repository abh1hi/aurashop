<template>
  <AdminLayout>
    <div class="page-header">
      <h1>Store Management</h1>
      <div class="search-bar">
        <LiquidInput 
          v-model="searchQuery" 
          placeholder="Search stores..." 
          icon="search" 
        />
      </div>
    </div>

    <div class="store-table-container">
      <div v-if="loading" class="loading-state">
         <div class="spinner"></div>
      </div>
      
      <table v-else-if="filteredStores.length > 0" class="users-table">
        <thead>
          <tr>
            <th>Store</th>
            <th>Owner ID</th>
            <th>Created At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="store in filteredStores" :key="store.id">
            <td>
              <div class="store-info">
                <img v-if="store.logoUrl" :src="store.logoUrl" class="store-logo" />
                <div v-else class="store-placeholder">
                  <span class="material-icons-round">store</span>
                </div>
                <div class="store-details">
                  <span class="store-name">{{ store.name || 'Untitled' }}</span>
                  <span class="store-category">{{ store.category || 'Uncategorized' }}</span>
                </div>
              </div>
            </td>
            <td>{{ store.ownerId ? store.ownerId.substring(0, 8) + '...' : '-' }}</td>
            <td>{{ formatDate(store.createdAt) }}</td>
            <td>
              <span class="status-badge" :class="store.isActive ? 'active' : 'banned'">
                {{ store.isActive ? 'Active' : 'Suspended' }}
              </span>
            </td>
            <td>
              <button 
                class="action-btn" 
                :class="store.isActive ? 'ban' : 'unban'"
                @click="handleStatusToggle(store)"
              >
                {{ store.isActive ? 'Suspend' : 'Activate' }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <p>No stores found.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import AdminLayout from '../components/AdminLayout.vue';

const { fetchStores, toggleStoreStatus, loading } = useAdmin();
const { showToast } = useToast();

const stores = ref<any[]>([]);
const searchQuery = ref('');

onMounted(async () => {
  stores.value = await fetchStores();
});

const filteredStores = computed(() => {
  if (!searchQuery.value) return stores.value;
  const query = searchQuery.value.toLowerCase();
  return stores.value.filter(s => 
    (s.name && s.name.toLowerCase().includes(query)) ||
    (s.category && s.category.toLowerCase().includes(query))
  );
});

const formatDate = (timestamp: any) => {
  if (!timestamp) return '-';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};

const handleStatusToggle = async (store: any) => {
  const action = store.isActive ? 'suspend' : 'activate';
  if (!confirm(`Are you sure you want to ${action} this store?`)) return;

  try {
    await toggleStoreStatus(store.id, !store.isActive);
    store.isActive = !store.isActive;
    showToast(`Store ${action}d successfully`, 'success');
  } catch (e) {
    showToast(`Failed to ${action} store`, 'error');
  }
};
</script>

<style scoped src="./StoreManagement.css"></style>
<style scoped src="../Users/UserManagement.css"></style>
