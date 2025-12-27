<template>
  <AdminLayout>
    <div class="user-search-page">
      <!-- Header -->
      <div class="page-header">
         <div>
            <h1 class="page-title">Advanced User Search</h1>
            <p class="page-subtitle">Find users by name, email, or filters.</p>
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
                    placeholder="Enter Name or Email..."
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
                <md-outlined-select label="Role" v-model="searchParams.role" class="filter-select">
                    <md-select-option value="">Any Role</md-select-option>
                    <md-select-option value="admin">Admin</md-select-option>
                    <md-select-option value="vendor">Vendor</md-select-option>
                    <md-select-option value="customer">Customer</md-select-option>
                </md-outlined-select>

                <md-outlined-select label="Status" v-model="searchParams.status" class="filter-select">
                    <md-select-option value="all">Any Status</md-select-option>
                    <md-select-option value="active">Active</md-select-option>
                    <md-select-option value="banned">Suspended</md-select-option>
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
                 <span>User</span>
                 <span>Role</span>
                 <span>Status</span>
                 <span>Joined</span>
                 <span>Actions</span>
             </div>
             
             <div v-for="user in results" :key="user.id" class="table-row">
                 <div class="col-user">
                     <div class="avatar">{{ getInitials(user.displayName) }}</div>
                     <div class="user-details">
                         <span class="name">{{ user.displayName || 'Unknown' }}</span>
                         <span class="email">{{ user.email }}</span>
                         <span class="uid-sub" @click.stop="copyToClipboard(user.id)" title="Click to copy ID">
                             ID: {{ user.id }}
                             <md-icon class="copy-icon">content_copy</md-icon>
                         </span>
                     </div>
                 </div>
                 
                 <div class="col-role">
                     <span v-if="user.isAdmin" class="badge admin">Admin</span>
                     <span v-else-if="user.isVendor" class="badge vendor">Vendor</span>
                     <span v-else class="badge customer">Customer</span>
                 </div>

                 <div class="col-status">
                     <span :class="['status-dot', user.isBanned ? 'banned' : 'active']"></span>
                     {{ user.isBanned ? 'Suspended' : 'Active' }}
                 </div>

                 <div class="col-date">
                     {{ formatDate(user.createdAt) }}
                 </div>

                 <div class="col-actions">
                     <md-icon-button @click="router.push(`/admin/users/${user.id}`)">
                         <md-icon>visibility</md-icon>
                     </md-icon-button>
                 </div>
             </div>
         </div>

         <div v-else class="empty-state">
             <md-icon>search_off</md-icon>
             <p>No users found matching your criteria.</p>
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
const { searchUsers, loading } = useAdmin();
const { showToast } = useToast();

const hasSearched = ref(false);
const results = ref<any[]>([]);

const searchParams = reactive({
    query: '',
    role: '',
    status: 'all' // all, active, banned
});

const handleSearch = async () => {
    hasSearched.value = true;
    const params: any = {
        query: searchParams.query || undefined,
        role: searchParams.role || undefined
    };

    if (searchParams.status !== 'all') {
        params.isBanned = searchParams.status === 'banned';
    }

    results.value = await searchUsers(params);
};

const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        showToast('ID copied to clipboard', 'success');
    } catch (e) {
        showToast('Failed to copy ID', 'error');
    }
};

const getInitials = (name?: string) => (name ? name[0].toUpperCase() : 'U');

const formatDate = (timestamp: any) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
};
</script>

<style scoped>
.user-search-page {
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
    grid-template-columns: 2.5fr 1fr 1fr 1fr 0.5fr;
    padding: 16px 24px;
    background: var(--md-sys-color-surface-container);
    font-weight: 600;
    color: var(--md-sys-color-on-surface-variant);
}

.table-row {
    display: grid;
    grid-template-columns: 2.5fr 1fr 1fr 1fr 0.5fr;
    padding: 16px 24px;
    align-items: center;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    transition: background 0.2s;
}

.table-row:hover { background: var(--md-sys-color-surface-container-low); }

.col-user {
    display: flex;
    gap: 12px;
    align-items: center;
}

.avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    background: var(--md-sys-color-primary-container);
    color: var(--md-sys-color-on-primary-container);
    display: flex; align-items: center; justify-content: center;
    font-weight: 600;
}

.user-details {
    display: flex;
    flex-direction: column;
}

.name { font-weight: 500; color: var(--md-sys-color-on-surface); }
.email { font-size: 0.85rem; color: var(--md-sys-color-on-surface-variant); }
.uid-sub { 
    font-size: 0.70rem; color: var(--md-sys-color-outline); font-family: monospace; 
    display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
    transition: color 0.2s;
}
.uid-sub:hover { color: var(--md-sys-color-primary); }
.copy-icon { font-size: 12px; opacity: 0; transition: opacity 0.2s; }
.uid-sub:hover .copy-icon { opacity: 1; }

.badge {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
}
.badge.admin { background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.badge.vendor { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.badge.customer { background: var(--md-sys-color-surface-variant); color: var(--md-sys-color-on-surface-variant); }

.status-dot {
    display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px;
}
.status-dot.active { background: green; }
.status-dot.banned { background: red; }

.loading-state, .empty-state {
    padding: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--md-sys-color-on-surface-variant);
    gap: 16px;
}
</style>
