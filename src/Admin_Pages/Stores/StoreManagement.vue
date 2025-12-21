<template>
  <AdminLayout>
    <div class="store-management-header">
      <div class="header-content">
        <h1 class="page-title">Ecosphere<span>Management</span></h1>
        <p class="page-subtitle">Monitor commercial throughput, brand integrity, and merchant status.</p>
      </div>
      <div class="search-wrap">
        <LiquidInput 
          v-model="searchQuery" 
          placeholder="Lookup store signature..." 
          icon="search" 
        />
      </div>
    </div>

    <div class="stores-viewport">
      <div v-if="loading" class="loading-state">
         <div class="skeleton-loader"></div>
      </div>
      
      <div v-else-if="filteredStores.length > 0" class="table-container">
        <!-- Desktop Header -->
        <div class="grid-header">
          <div class="col-store">Brand Entity</div>
          <div class="col-performance">Performance</div>
          <div class="col-status">Status & Visibility</div>
          <div class="col-actions">Control</div>
        </div>

        <div class="grid-rows">
          <div v-for="store in filteredStores" :key="store.id" class="data-row">
            <div class="col-store">
              <div class="brand-card">
                <div class="brand-logo-wrap">
                  <img v-if="store.logoUrl" :src="store.logoUrl" class="brand-logo" />
                  <div v-else class="brand-placeholder">
                    <span class="material-icons-round">hub</span>
                  </div>
                </div>
                <div class="brand-details">
                  <span class="brand-name">{{ store.name || 'Incognito Protocol' }}</span>
                  <span class="brand-category">{{ store.category || 'Standard' }}</span>
                </div>
              </div>
            </div>

            <div class="col-performance">
                <div class="metric-group">
                    <label>Commission</label>
                    <div class="commission-control">
                        <input 
                            type="number" 
                            class="glass-input-sm" 
                            :value="store.commissionRate || 0" 
                            @change="(e) => handleCommissionUpdate(store, (e.target as HTMLInputElement).value)"
                            min="0"
                            max="100"
                        />
                        <span class="unit">%</span>
                    </div>
                </div>
            </div>

            <div class="col-status">
              <div class="status-controls">
                <!-- Status Dropdown -->
                <div class="status-selector">
                    <LiquidDropdown 
                        :model-value="getStoreStatusLabel(store)"
                        :options="storeStatusOptions"
                        @change="(val: any) => handleStatusChange(store, val)"
                    />
                </div>
                
                <!-- Visibility Toggle -->
                <button 
                    class="icon-btn-glass toggle-vis"
                    :class="{ 'active': store.isVisible }"
                    @click="handleVisibilityToggle(store)"
                    :title="store.isVisible ? 'Hide from Marketplace' : 'Show on Marketplace'"
                >
                    <span class="material-icons-round">{{ store.isVisible ? 'visibility' : 'visibility_off' }}</span>
                </button>
              </div>
            </div>

            <div class="col-actions">
              <div class="action-cluster">
                  <a :href="`/store/${store.id}`" target="_blank" class="icon-btn-glass" title="Visit Storefront">
                      <span class="material-icons-round">storefront</span>
                  </a>
                  <a :href="`mailto:${store.ownerEmail}`" class="icon-btn-glass" title="Email Owner">
                      <span class="material-icons-round">mail</span>
                  </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <span class="material-icons-round">blur_off</span>
        <h3>No operational nodes detected</h3>
        <p>Awaiting store propagation signals.</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidDropdown from '../../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import AdminLayout from '../components/AdminLayout.vue';

const { fetchStores, updateStoreCommission, toggleStoreVisibility, updateStoreStatus, loading } = useAdmin();
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



const storeStatusOptions = [
    { label: 'Active', value: 'active', icon: 'check_circle', class: 'text-success' },
    { label: 'Under Review', value: 'under_review', icon: 'pending', class: 'text-warning' },
    { label: 'Suspended', value: 'suspended', icon: 'block', class: 'text-danger' }
];

const getStoreStatusLabel = (store: any) => {
    const status = store.status || (store.isActive ? 'active' : 'suspended');
    const option = storeStatusOptions.find(o => o.value === status);
    return option ? option.label : 'Unknown';
};

const handleCommissionUpdate = async (store: any, val: string) => {
    const rate = parseFloat(val);
    if (isNaN(rate) || rate < 0 || rate > 100) return;
    
    try {
        await updateStoreCommission(store.id, rate);
        store.commissionRate = rate;
        showToast('Commission updated', 'success');
    } catch (e) {
        showToast('Failed to update commission', 'error');
    }
};

const handleVisibilityToggle = async (store: any) => {
    try {
        const newState = !store.isVisible;
        await toggleStoreVisibility(store.id, newState);
        store.isVisible = newState;
        showToast(`Store ${newState ? 'visible' : 'hidden'}`, 'success');
    } catch (e) {
        showToast('Failed to toggle visibility', 'error');
    }
};

const handleStatusChange = async (store: any, newStatus: any) => {
    if (!newStatus) return;
    try {
        await updateStoreStatus(store.id, newStatus);
        store.status = newStatus;
        store.isActive = newStatus === 'active';
        showToast(`Status updated to ${newStatus}`, 'success');
    } catch (e) {
        showToast('Failed to update status', 'error');
    }
};
</script>

<style scoped src="./StoreManagement.css"></style>
<style scoped src="../Users/UserManagement.css"></style>
