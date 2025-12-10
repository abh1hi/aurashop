<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">arrow_back</span>
        Back to Dashboard
      </div>

      <div class="page-header">
        <h1 class="page-title">Manage Orders</h1>
        <div class="header-actions">
           <LiquidButton 
            text="Export CSV" 
            icon="download" 
            type="ghost" 
            size="sm"
          />
        </div>
      </div>

      <!-- Status Tabs -->
      <LiquidTabs 
        :tabs="tabs" 
        v-model="activeTab" 
        class="mb-lg"
      />

      <!-- Orders List -->
      <div class="orders-container">
        <div v-if="loading" class="loading-state">
          <LiquidSpinner />
        </div>
        
        <div v-else-if="filteredOrders.length === 0" class="empty-state">
          <span class="material-icons-round">shopping_bag</span>
          <h3>No orders found</h3>
          <p>There are no orders in this category.</p>
        </div>

        <div v-else class="orders-list">
          <div v-for="order in filteredOrders" :key="order.id" class="order-item" @click="viewOrder(order.id)">
            <div class="order-main">
              <div class="order-header">
                <span class="order-id">#{{ order.id.slice(0, 8) }}</span>
                <span class="order-date">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="order-customer">
                <span class="material-icons-round">person</span>
                {{ order.customerName || 'Guest Customer' }}
              </div>
            </div>
            
            <div class="order-meta">
              <div class="order-total">${{ order.total?.toFixed(2) }}</div>
              <span class="status-pill" :class="order.status">{{ order.status }}</span>
            </div>
            
            <div class="order-action">
              <span class="material-icons-round">chevron_right</span>
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
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' }
];

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value;
  return orders.value.filter(o => o.status === activeTab.value);
});

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp.seconds * 1000).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

const viewOrder = (orderId) => {
  // router.push(`/vendor/store/${route.params.id}/orders/${orderId}`);
  // For now, just log or show a toast as the details page isn't fully ready
  console.log('View order', orderId);
};

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
    loading.value = true;
    try {
      // Fetch more orders for the list page
      orders.value = await fetchStoreOrders(storeId, 50); 
    } catch (e) {
      console.error("Failed to load orders", e);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped src="./StoreOrdersPage.css"></style>
