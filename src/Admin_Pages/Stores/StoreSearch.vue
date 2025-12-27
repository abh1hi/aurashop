<template>
  <AdminLayout>
    <div class="store-search-page">
      <!-- Header -->
      <div class="page-header">
         <div>
            <h1 class="page-title">Advanced Store Search</h1>
            <p class="page-subtitle">Find stores by name, ID, or filters.</p>
         </div>
         <md-outlined-button @click="router.back()">
            <md-icon slot="icon">arrow_back</md-icon>
            Back
         </md-outlined-button>
      </div>

      <!-- Search & Filter Card -->
      <div class="m3-card search-card">
         <div class="search-form">
            <!-- Main Search Input -->
            <div class="search-row">
                <md-outlined-text-field 
                    label="Search Query" 
                    placeholder="Enter Store Name or ID..."
                    v-model="searchParams.query"
                    @keyup.enter="handleSearch"
                    class="flex-grow"
                >
                    <md-icon slot="leading-icon">search</md-icon>
                </md-outlined-text-field>
                <md-filled-button @click="handleSearch" :disabled="loading">
                    <md-icon slot="icon">search</md-icon>
                    Search
                </md-filled-button>
            </div>

            <!-- Filters -->
            <div class="filters-row">
                <md-outlined-select label="Status" v-model="searchParams.status" class="filter-select">
                    <md-select-option value="all">Any Status</md-select-option>
                    <md-select-option value="active">Active</md-select-option>
                    <md-select-option value="suspended">Suspended</md-select-option>
                    <md-select-option value="under_review">Under Review</md-select-option>
                </md-outlined-select>

                <md-outlined-select label="KYC Status" v-model="searchParams.kycStatus" class="filter-select">
                    <md-select-option value="all">Any KYC Status</md-select-option>
                    <md-select-option value="verified">Verified</md-select-option>
                    <md-select-option value="pending">Pending</md-select-option>
                    <md-select-option value="rejected">Rejected</md-select-option>
                </md-outlined-select>
            </div>
         </div>
      </div>

      <!-- Results Table -->
      <div class="m3-card results-card" v-if="hasSearched">
         <div v-if="loading" class="loading-state">
             <md-circular-progress indeterminate></md-circular-progress>
         </div>
         
         <div v-else-if="results.length > 0" class="results-table">
             <div class="table-header">
                 <span>Store</span>
                 <span>Category</span>
                 <span>Status</span>
                 <span>KYC</span>
                 <span>Actions</span>
             </div>
             
             <div v-for="store in results" :key="store.id" class="table-row">
                 <div class="col-store">
                     <div class="logo-wrap">
                        <img v-if="store.logoUrl" :src="store.logoUrl" class="store-logo" />
                        <div v-else class="store-placeholder">
                           <md-icon>storefront</md-icon>
                        </div>
                     </div>
                     <div class="store-details">
                         <span class="name">{{ store.name || 'Unnamed Store' }}</span>
                         <span class="uid-sub" @click.stop="copyToClipboard(store.id)" title="Click to copy ID">
                             ID: {{ store.id }}
                             <md-icon class="copy-icon">content_copy</md-icon>
                         </span>
                     </div>
                 </div>
                 
                 <div class="col-cat">
                     {{ store.category || 'General' }}
                 </div>

                 <div class="col-status">
                     <span :class="['status-dot', getStatusColor(store.status)]"></span>
                     {{ formatStatus(store.status) }}
                 </div>

                 <div class="col-kyc">
                     <span :class="['badge', getKYCBadgeClass(store.kycStatus)]">{{ formatStatus(store.kycStatus) }}</span>
                 </div>

                 <div class="col-actions">
                     <md-icon-button @click="router.push(`/admin/stores/${store.id}`)">
                         <md-icon>visibility</md-icon>
                     </md-icon-button>
                     <md-icon-button @click="router.push(`/admin/stores/${store.id}/activity`)">
                         <md-icon>history</md-icon>
                     </md-icon-button>
                 </div>
             </div>
         </div>

         <div v-else class="empty-state">
             <md-icon>search_off</md-icon>
             <p>No stores found matching your criteria.</p>
         </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../components/AdminLayout.vue';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';

const router = useRouter();
const { searchStores, loading } = useAdmin();
const { showToast } = useToast();

const hasSearched = ref(false);
const results = ref<any[]>([]);

const searchParams = reactive({
    query: '',
    status: 'all',
    kycStatus: 'all'
});

const handleSearch = async () => {
    hasSearched.value = true;
    const params: any = {
        query: searchParams.query || undefined
    };

    if (searchParams.status !== 'all') params.status = searchParams.status;
    if (searchParams.kycStatus !== 'all') params.kycStatus = searchParams.kycStatus;

    results.value = await searchStores(params);
};

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast('ID copied to clipboard', 'success');
    } catch (e) {
        showToast('Failed to copy ID', 'error');
    }
};

// Helpers
const formatStatus = (status: string) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const getStatusColor = (status: string) => {
    switch(status) {
        case 'active': return 'active';
        case 'suspended': return 'banned';
        case 'under_review': return 'warning';
        default: return 'neutral';
    }
};

const getKYCBadgeClass = (status: string) => {
    switch(status) {
        case 'verified': return 'success';
        case 'rejected': return 'error';
        case 'pending':
        case 'pending_review': return 'warning';
        default: return 'neutral';
    }
};
</script>

<style scoped>
.store-search-page {
    margin: 0 auto;
    width: 100%;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.page-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--md-sys-color-on-background);
}
.page-subtitle { color: var(--md-sys-color-on-surface-variant); }

.m3-card {
    background: var(--md-sys-color-surface);
    border-radius: 24px;
    border: 1px solid var(--md-sys-color-outline-variant);
    overflow: hidden;
    margin-bottom: 2rem;
}

.search-card { padding: 24px; }

.search-row {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
}

.flex-grow { flex: 1; }

.filters-row {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.filter-select { min-width: 200px; }

/* Table Styles */
.results-table {
    display: flex;
    flex-direction: column;
}

.table-header {
    display: grid;
    grid-template-columns: 2.5fr 1fr 1fr 1fr 0.8fr;
    padding: 16px 24px;
    background: var(--md-sys-color-surface-container);
    font-weight: 600;
    color: var(--md-sys-color-on-surface-variant);
}

.table-row {
    display: grid;
    grid-template-columns: 2.5fr 1fr 1fr 1fr 0.8fr;
    padding: 16px 24px;
    align-items: center;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    transition: background 0.2s;
}

.table-row:hover { background: var(--md-sys-color-surface-container-low); }

.col-store {
    display: flex;
    gap: 12px;
    align-items: center;
}

.logo-wrap {
    width: 40px; height: 40px;
    border-radius: 8px;
    background: var(--md-sys-color-surface-container-high);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
}
.store-logo { width: 100%; height: 100%; object-fit: cover; }
.store-placeholder { color: var(--md-sys-color-on-surface-variant); }

.store-details {
    display: flex;
    flex-direction: column;
}

.name { font-weight: 500; color: var(--md-sys-color-on-surface); }
.uid-sub { 
    font-size: 0.70rem; color: var(--md-sys-color-outline); font-family: monospace; 
    display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
    transition: color 0.2s;
}
.uid-sub:hover { color: var(--md-sys-color-primary); }
.copy-icon { font-size: 12px; opacity: 0; transition: opacity 0.2s; }
.uid-sub:hover .copy-icon { opacity: 1; }

.col-cat { font-size: 0.9rem; color: var(--md-sys-color-on-surface-variant); }

.col-actions { display: flex; gap: 4px; justify-content: flex-end; }

.badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
}
.badge.success { background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); }
.badge.error { background: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); }
.badge.warning { background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.badge.neutral { background: var(--md-sys-color-surface-variant); color: var(--md-sys-color-on-surface-variant); }

.status-dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px;
}
.status-dot.active { background: green; }
.status-dot.banned { background: red; }
.status-dot.warning { background: orange; }
.status-dot.neutral { background: gray; }

.loading-state, .empty-state {
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--md-sys-color-on-surface-variant);
    gap: 16px;
}
</style>
