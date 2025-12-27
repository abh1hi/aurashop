<template>
  <AdminLayout>
    <div class="store-detail-page">
      
      <div v-if="loading" class="loading-container">
         <md-circular-progress indeterminate></md-circular-progress>
      </div>

      <div v-else-if="store" class="content-container">
          <!-- Header -->
          <header class="page-header">
             <div class="header-left">
                <md-icon-button @click="$router.push('/admin/stores')"><md-icon>arrow_back</md-icon></md-icon-button>
                <div class="header-titles">
                   <h1 class="headline-medium">{{ store.name }}</h1>
                   <div class="badges">
                      <span class="status-badge" :class="store.status">{{ store.status || 'Pending' }}</span>
                      <span class="id-badge">ID: {{ store.id }}</span>
                   </div>
                </div>
             </div>
             <div class="header-actions">
                <md-filled-tonal-button @click="editStore">
                    <md-icon slot="icon">edit</md-icon>
                    Edit
                </md-filled-tonal-button>
             </div>
          </header>

          <!-- Stats Grid -->
          <div class="stats-grid">
             <div class="m3-card stat-card">
                <div class="stat-icon surface-variant"><md-icon>attach_money</md-icon></div>
                <div class="stat-info">
                   <span class="label">Total Revenue</span>
                   <span class="value">{{ formatCurrency(stats.revenue || 0) }}</span>
                </div>
             </div>
             <div class="m3-card stat-card">
                <div class="stat-icon secondary-container"><md-icon>shopping_bag</md-icon></div>
                <div class="stat-info">
                   <span class="label">Total Orders</span>
                   <span class="value">{{ stats.orders || 0 }}</span>
                </div>
             </div>
             <div class="m3-card stat-card">
                <div class="stat-icon tertiary-container"><md-icon>inventory_2</md-icon></div>
                <div class="stat-info">
                   <span class="label">Products</span>
                   <span class="value">{{ stats.products || 0 }}</span>
                </div>
             </div>
             <div class="m3-card stat-card">
                <div class="stat-icon error-container"><md-icon>star</md-icon></div>
                <div class="stat-info">
                   <span class="label">Rating</span>
                   <span class="value">{{ store.rating || 'N/A' }}</span>
                </div>
             </div>
          </div>

          <!-- Main Content Tabs -->
           <div class="m3-tabs">
               <button class="tab-btn" :class="{ active: activeTab === 'overview' }" @click="activeTab = 'overview'">Overview</button>
               <button class="tab-btn" :class="{ active: activeTab === 'products' }" @click="activeTab = 'products'">Products</button>
               <button class="tab-btn" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">Orders</button>
           </div>

           <!-- Overview Tab -->
           <div v-if="activeTab === 'overview'" class="tab-pane">
              <div class="grid-layout">
                  <!-- Info Card -->
                  <div class="m3-card info-card">
                     <h3 class="title-medium card-title">Store Information</h3>
                     
                     <div class="info-row">
                        <span class="label">Category</span>
                        <span class="value">{{ store.category || 'Uncategorized' }}</span>
                     </div>
                     <div class="info-row">
                        <span class="label">Description</span>
                        <span class="value">{{ store.description || 'No description provided.' }}</span>
                     </div>
                     <div class="info-row">
                        <span class="label">Owner UID</span>
                        <span class="value mono">{{ store.ownerId }}</span>
                     </div>
                     <div class="info-row">
                        <span class="label">Created At</span>
                        <span class="value">{{ formatDate(store.createdAt) }}</span>
                     </div>
                  </div>

                  <!-- Contact Card -->
                  <div class="m3-card info-card">
                     <h3 class="title-medium card-title">Contact & Location</h3>
                     
                     <div class="info-row">
                        <span class="label">Email</span>
                        <span class="value">{{ store.email || '-' }}</span>
                     </div>
                     <div class="info-row">
                        <span class="label">Phone</span>
                        <span class="value">{{ store.phone || '-' }}</span>
                     </div>
                     <div class="info-row">
                        <span class="label">Address</span>
                        <span class="value">{{ store.address || '-' }}</span>
                     </div>
                  </div>
              </div>
           </div>

           <!-- Products Tab Placeholder -->
           <div v-if="activeTab === 'products'" class="tab-pane">
               <div class="empty-placeholder">
                   <md-icon>inventory</md-icon>
                   <p>Products list coming soon.</p>
               </div>
           </div>

            <!-- Orders Tab Placeholder -->
           <div v-if="activeTab === 'orders'" class="tab-pane">
               <div class="empty-placeholder">
                   <md-icon>receipt_long</md-icon>
                   <p>Orders history coming soon.</p>
               </div>
           </div>
      </div>

      <div v-else class="error-state">
          <md-icon>error</md-icon>
          <p>Store not found or access denied.</p>
          <md-filled-button @click="$router.push('/admin/stores')">Go Back</md-filled-button>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFirestore, doc, getDoc, collection, getCountFromServer } from 'firebase/firestore';
import AdminLayout from '../components/AdminLayout.vue';

const route = useRoute();
const router = useRouter();
const db = getFirestore();

const storeId = route.params.id as string;
const loading = ref(true);
const store = ref<any>(null);
const activeTab = ref('overview');
const stats = ref({
    revenue: 0,
    orders: 0,
    products: 0
});

onMounted(async () => {
    await fetchStoreDetails();
});

const fetchStoreDetails = async () => {
    loading.value = true;
    try {
        const storeRef = doc(db, 'stores', storeId);
        const storeSnap = await getDoc(storeRef);
        
        if (storeSnap.exists()) {
            store.value = { id: storeSnap.id, ...storeSnap.data() };
            
            // Fetch stats (Counts)
            // Note: This matches subcollections. If they don't exist yet, it returns 0.
            try {
                const productsColl = collection(storeRef, 'products');
                const productsSnap = await getCountFromServer(productsColl);
                stats.value.products = productsSnap.data().count;

                const ordersColl = collection(storeRef, 'orders'); // Assuming orders are subcollection or we query root orders by storeId
                // For now, let's try subcollection count
                const ordersSnap = await getCountFromServer(ordersColl);
                stats.value.orders = ordersSnap.data().count;
            } catch (e) {
                console.warn('Failed to fetch detailed stats', e);
            }
            
        } else {
            store.value = null;
        }
    } catch (e) {
        console.error('Error fetching store:', e);
        store.value = null;
    } finally {
        loading.value = false;
    }
};

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
};

const formatDate = (val: any) => {
    if (!val) return '-';
    // Handle Firestore Timestamp or Date
    const d = val.toDate ? val.toDate() : new Date(val);
    return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(d);
};

const editStore = () => {
    // Navigate to edit page or open modal (Placeholder)
    alert('Edit functionality to be implemented');
};
</script>

<style scoped>
.store-detail-page {
    max-width: 1200px;
    margin: 0 auto;
}

.loading-container, .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 400px;
    gap: 16px;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-titles .headline-medium {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 400;
}

.badges {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
}

.status-badge {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    background: var(--md-sys-color-surface-variant);
}
.status-badge.active { background: var(--md-sys-color-primary-container); color: var(--md-sys-color-on-primary-container); }

.id-badge {
    font-family: monospace;
    font-size: 0.75rem;
    color: var(--md-sys-color-on-surface-variant);
}

/* Stats */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
}

.stat-card {
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 16px;
    background: var(--md-sys-color-surface);
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--md-sys-color-on-surface);
}
.surface-variant { background: var(--md-sys-color-surface-variant); }
.secondary-container { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.tertiary-container { background: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.error-container { background: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); }

.stat-info { display: flex; flex-direction: column; }
.stat-info .label { font-size: 0.8rem; color: var(--md-sys-color-on-surface-variant); }
.stat-info .value { font-size: 1.25rem; font-weight: 500; }

/* Tabs */
.m3-tabs {
    display: flex;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    margin-bottom: 24px;
}

.tab-btn {
    padding: 12px 24px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--md-sys-color-on-surface-variant);
    cursor: pointer;
}

.tab-btn.active {
    color: var(--md-sys-color-primary);
    border-bottom-color: var(--md-sys-color-primary);
}

/* Tab Content */
.grid-layout {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
}

.info-card {
    background: var(--md-sys-color-surface);
    padding: 24px;
    border-radius: 16px;
    border: 1px solid var(--md-sys-color-outline-variant);
}

.card-title {
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--md-sys-color-primary);
}

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}
.info-row:last-child { border-bottom: none; }

.info-row .label { color: var(--md-sys-color-on-surface-variant); }
.info-row .value { font-weight: 500; text-align: right; }
.mono { font-family: monospace; }

.empty-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    color: var(--md-sys-color-on-surface-variant);
    gap: 16px;
}
.empty-placeholder md-icon { font-size: 48px; }
</style>
