<template>
  <AdminLayout>
    <div class="store-page">
      <!-- M3 Standard Header -->
      <header class="page-header">
        <div class="header-text">
          <h1 class="headline-large">Store Operations</h1>
          <p class="body-large subtext">Monitor commercial throughput and merchant nodes.</p>
        </div>
      </header>

      <!-- Search & Filters -->
      <div class="filter-bar">
         <md-outlined-text-field 
            label="Search stores..." 
            class="search-field"
            :value="searchQuery"
            @input="searchQuery = $event.target.value"
         >
           <md-icon slot="leading-icon">search</md-icon>
         </md-outlined-text-field>

         <md-filled-tonal-button @click="router.push('/admin/stores/search')" class="adv-search-btn">
             <md-icon slot="icon">manage_search</md-icon>
             Advanced Search
         </md-filled-tonal-button>
      </div>

      <!-- Store List -->
      <div class="m3-card list-card">
        <div v-if="loading" class="loading-state">
           <md-circular-progress indeterminate></md-circular-progress>
        </div>
        
        <div v-else-if="filteredStores.length > 0" class="list-container">
           <!-- Desktop Header -->
           <div class="list-header desktop-only">
              <span class="col-main">Brand Entity</span>
              <span class="col-kpi">Commission</span>
              <span class="col-status">Status</span>
              <span class="col-vis">Visibility</span>
              <span class="col-actions"></span>
           </div>

           <!-- List Items -->
           <div 
                v-for="store in filteredStores" 
                :key="store.id" 
                class="list-item"
           >
              <!-- Brand Info (Clickable) -->
              <div class="col-main brand-info clickable-area" @click="router.push(`/admin/stores/${store.id}`)">
                 <div class="logo-wrap">
                    <img v-if="store.logoUrl" :src="store.logoUrl" class="brand-logo" />
                    <div v-else class="brand-placeholder">
                       <md-icon>storefront</md-icon>
                    </div>
                 </div>
                 <div class="text-content">
                    <span class="title-medium">{{ store.name || 'Unnamed Store' }}</span>
                    <span class="body-medium">{{ store.category || 'General' }}</span>
                 </div>
              </div>

              <!-- Commission Control -->
              <div class="col-kpi desktop-only">
                  <div class="commission-input-group">
                      <md-outlined-text-field 
                          type="number"
                          suffix-text="%"
                          :value="store.commissionRate || 0"
                          @change="(e:any) => handleCommissionUpdate(store, e.target.value)"
                          style="width: 100px;"
                          density="compact"
                      ></md-outlined-text-field>
                  </div>
              </div>

              <!-- Status Selector -->
              <div class="col-status desktop-only">
                  <div class="status-menu-wrap">
                      <md-outlined-select 
                          :value="getStoreStatusValue(store)"
                          @input="(e:any) => handleStatusChange(store, e.target.value)"
                          density="compact"
                      >
                          <md-select-option value="active">
                              <div slot="headline">Active</div>
                          </md-select-option>
                           <md-select-option value="under_review">
                              <div slot="headline">Under Review</div>
                          </md-select-option>
                           <md-select-option value="suspended">
                              <div slot="headline">Suspended</div>
                          </md-select-option>
                      </md-outlined-select>
                  </div>
              </div>

              <!-- Visibility Toggle -->
              <div class="col-vis desktop-only">
                  <md-icon-button 
                      :selected="store.isVisible" 
                      toggle 
                      @click="handleVisibilityToggle(store)"
                      :title="store.isVisible ? 'Hide from Marketplace' : 'Show on Marketplace'"
                  >
                      <md-icon slot="onIcon">visibility</md-icon>
                      <md-icon slot="icon">visibility_off</md-icon>
                  </md-icon-button>
              </div>

              <!-- Actions -->
              <div class="col-actions desktop-only">
                  <md-icon-button @click.stop="router.push(`/admin/stores/${store.id}/activity`)" title="Activity Log">
                      <md-icon>history_edu</md-icon>
                  </md-icon-button>
                  <md-icon-button :href="`/store/${store.id}`" target="_blank" @click.stop title="Visit Storefront">
                      <md-icon>launch</md-icon>
                  </md-icon-button>
              </div>

              <!-- Mobile Actions -->
               <div class="mobile-only action-cluster">
                   <md-icon-button @click="openMobileActions(store)">
                       <md-icon>more_vert</md-icon>
                   </md-icon-button>
               </div>
           </div>
        </div>

        <div v-else class="empty-state">
           <md-icon class="empty-icon">storefront_off</md-icon>
           <p class="body-large">No operational stores found.</p>
        </div>
      </div>
      
       <!-- Mobile Action Sheet Overlay -->
      <Transition name="slide-up">
        <div v-if="showMobileSheet && selectedStore" class="mobile-action-sheet-overlay" @click="closeMobileSheet">
           <div class="action-sheet" @click.stop>
               <div class="sheet-handle"></div>
               <div class="sheet-header">
                  <h3 class="title-large">{{ selectedStore.name }}</h3>
               </div>
               <div class="sheet-actions">
                  <md-list-item type="button" @click="handleVisibilityToggle(selectedStore)">
                     <md-icon slot="start">{{ selectedStore.isVisible ? 'visibility_off' : 'visibility' }}</md-icon>
                     <div slot="headline">{{ selectedStore.isVisible ? 'Hide Store' : 'Publish Store' }}</div>
                  </md-list-item>
                  <md-list-item type="button" @click="router.push(`/admin/stores/${selectedStore.id}/activity`)">
                     <md-icon slot="start">history_edu</md-icon>
                     <div slot="headline">View Activity Log</div>
                  </md-list-item>
               </div>
           </div>
        </div>
      </Transition>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import AdminLayout from '../components/AdminLayout.vue';

const router = useRouter();
const { fetchStores, updateStoreCommission, toggleStoreVisibility, updateStoreStatus, loading } = useAdmin();
const { showToast } = useToast();

const stores = ref<any[]>([]);
const searchQuery = ref('');
const showMobileSheet = ref(false);
const selectedStore = ref<any>(null);

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

const getStoreStatusValue = (store: any) => {
    return store.status || (store.isActive ? 'active' : 'suspended');
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
        if (showMobileSheet.value) closeMobileSheet();
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

// Mobile Actions
const openMobileActions = (store: any) => {
    selectedStore.value = store;
    showMobileSheet.value = true;
};

const closeMobileSheet = () => {
    showMobileSheet.value = false;
    setTimeout(() => selectedStore.value = null, 300);
};
</script>

<style scoped>
/* Common Styles */
.store-page { /* Padding handled */ max-width: 1200px; margin: 0 auto; }
.page-header { margin-bottom: 24px; }
.headline-large { font-family: var(--md-sys-typescale-headline-large-font); font-size: var(--md-sys-typescale-headline-large-size); font-weight: 400; color: var(--md-sys-color-on-background); margin: 0; }
.body-large { font-size: 1rem; color: var(--md-sys-color-on-surface-variant); }
.filter-bar { margin-bottom: 16px; display: flex; gap: 12px; align-items: center; }
.search-field { flex: 1; max-width: 400px; }

/* List Card */
.m3-card { background: var(--md-sys-color-surface); border-radius: 16px; border: 1px solid var(--md-sys-color-outline-variant); overflow: hidden; }
.list-header { display: flex; padding: 16px; background: var(--md-sys-color-surface-container); border-bottom: 1px solid var(--md-sys-color-outline-variant); font-weight: 500; color: var(--md-sys-color-on-surface-variant); }
.list-item { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--md-sys-color-outline-variant); transition: background 0.2s; }
.list-item:hover { background: var(--md-sys-color-surface-container-low); }

/* Columns */
.col-main { flex: 2; display: flex; align-items: center; gap: 16px; }
.clickable-area { cursor: pointer; transition: opacity 0.2s; }
.clickable-area:hover { opacity: 0.8; }
.col-kpi { flex: 1; }
.col-status { flex: 1; }
.col-vis { flex: 0.5; text-align: center; }
.col-actions { flex: 0.8; display: flex; justify-content: flex-end; gap: 4px; }

/* Brand Info */
.brand-info .logo-wrap {
    width: 48px; height: 48px;
    border-radius: 12px;
    overflow: hidden;
    background: var(--md-sys-color-surface-container-high);
    display: flex; align-items: center; justify-content: center;
}
.brand-logo { width: 100%; height: 100%; object-fit: cover; }
.brand-placeholder { color: var(--md-sys-color-on-surface-variant); }

.text-content { display: flex; flex-direction: column; }
.title-medium { font-size: 1rem; font-weight: 500; color: var(--md-sys-color-on-surface); }
.body-medium { font-size: 0.875rem; color: var(--md-sys-color-on-surface-variant); }

/* Mobile Sheet */
.mobile-action-sheet-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; display: flex; align-items: flex-end; }
.action-sheet { background: var(--md-sys-color-surface); width: 100%; border-radius: 28px 28px 0 0; padding: 16px 0 32px 0; box-shadow: 0 -4px 10px rgba(0,0,0,0.2); animation: slideUp 0.3s cubic-bezier(0.2, 0, 0, 1); }
.sheet-handle { width: 32px; height: 4px; background: var(--md-sys-color-outline-variant); border-radius: 2px; margin: 0 auto 16px auto; }
.sheet-header { padding: 0 24px 16px 24px; border-bottom: 1px solid var(--md-sys-color-outline-variant); margin-bottom: 8px; }
.title-large { font-size: 1.3rem; margin: 0; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

.mobile-only { display: none; }
@media (max-width: 768px) {
    .desktop-only { display: none; }
    .mobile-only { display: block; }
    .list-header { display: none; }
    .col-main { flex: 1; }
}
</style>
