<template>
  <div class="page-container">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">west</span>
        Dashboard
      </div>

      <div class="page-header">
        <h1 class="page-title">Orders Management</h1>
        <div class="header-actions">
           <LiquidButton 
            text="Export Data" 
            icon="file_download" 
            type="ghost" 
            size="sm"
          />
        </div>
      </div>

      <div class="stats-ribbon mb-lg">
        <div class="stat-pill">
          <span class="label">Total Orders</span>
          <span class="value">{{ orders.length }}</span>
        </div>
        <div class="stat-pill">
          <span class="label">Pending</span>
          <span class="value">{{ orders.filter(o => o.status === 'pending').length }}</span>
        </div>
        <div class="stat-pill highlight">
          <span class="label">Revenue</span>
          <span class="value">${{ totalRevenue.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Status Tabs -->
      <LiquidTabs 
        :tabs="tabs" 
        v-model="activeTab" 
        class="mb-lg"
      />

      <!-- Orders List -->
      <div class="orders-viewport">
        <div v-if="loading" class="loading-state">
          <LiquidSpinner />
        </div>
        
        <div v-else-if="filteredOrders.length === 0" class="empty-state">
          <div class="empty-icon-wrap">
            <span class="material-icons-round">history_toggle_off</span>
          </div>
          <h3>Void Pipeline</h3>
          <p>No transactions detected in this status protocol.</p>
        </div>

        <div v-else class="orders-grid">
          <!-- Table Header (Desktop) -->
          <div class="grid-header">
            <span>Identifier</span>
            <span>Customer</span>
            <span>Valuation</span>
            <span>Protocal Status</span>
            <span>Temporal Data</span>
            <span class="text-right">Action</span>
          </div>

          <div v-for="order in filteredOrders" :key="order.id" class="order-row" @click="viewOrder(order.id)">
            <div class="order-id-col">
              <span class="id-symbol">#</span>
              <span class="id-value">{{ order.id.slice(0, 8).toUpperCase() }}</span>
            </div>
            
            <div class="customer-col">
              <div class="avatar-sm">
                {{ (order.customerName || 'G')[0].toUpperCase() }}
              </div>
              <span class="customer-name text-truncate">{{ order.customerName || 'Anonymous Guest' }}</span>
            </div>

            <div class="valuation-col">
              <span class="currency">$</span>
              <span class="amount">{{ order.total?.toFixed(2) }}</span>
            </div>
            
            <div class="status-col">
              <div class="status-badge" :class="order.status">
                <span class="dot"></span>
                {{ order.status }}
              </div>
            </div>

            <div class="date-col">
              {{ formatDate(order.createdAt) }}
            </div>
            
            <div class="action-col">
              <button class="view-btn">
                <span class="material-icons-round">open_in_new</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidTabs from '../components/liquid-ui-kit/LiquidTabs/LiquidTabs.vue';
import LiquidSpinner from '../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useVendor } from '../composables/useVendor';

const route = useRoute();
const router = useRouter();
const { fetchStoreOrders } = useVendor();

const loading = ref(true);
const orders = ref([]);
const activeTab = ref('all');

const tabs = [
  { label: 'All Protocols', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Complete', value: 'completed' },
  { label: 'Voided', value: 'cancelled' }
];

const totalRevenue = computed(() => {
    return orders.value
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);
});

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value;
  return orders.value.filter(o => o.status === activeTab.value);
});

const formatDate = (timestamp) => {
  if (!timestamp) return '---';
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: '2-digit'
  });
};

const viewOrder = (orderId) => {
  router.push(`/vendor/store/${route.params.id}/orders/${orderId}`);
};

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
    loading.value = true;
    try {
      orders.value = await fetchStoreOrders(storeId, 100); 
    } catch (e) {
      console.error("Pipeline Sync Failure", e);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped src="./StoreOrdersPage.css"></style>
