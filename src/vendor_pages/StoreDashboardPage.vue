<template>
  <div class="page-container">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      <header class="dashboard-header">
        <h1 class="page-title">Store Dashboard</h1>
        <div class="header-actions">
          <LiquidButton 
            text="Store Settings" 
            icon="settings" 
            type="glass" 
            size="sm"
            @click="router.push(`/vendor/store/${route.params.id}/settings`)"
          />
          <LiquidButton 
            text="Add Product" 
            icon="add" 
            type="primary" 
            size="sm"
            @click="router.push(`/vendor/store/${route.params.id}/add-product`)"
          />
        </div>
      </header>

      <!-- Stats Grid -->
      <LiquidStats :stats="dashboardStats" class="mb-lg" />

      <!-- Quick Actions -->
      <section class="dashboard-section">
        <h2 class="section-title">Store Operations</h2>
        <div class="actions-grid">
          <div class="action-card" @click="router.push(`/vendor/store/${route.params.id}/products`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">category</span>
              </div>
              <div class="action-text">
                <h3>Product Catalog</h3>
                <p>Manage inventory</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">east</span>
            </div>
          </div>

          <div class="action-card" @click="router.push(`/vendor/store/${route.params.id}/add-product`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">add_shopping_cart</span>
              </div>
              <div class="action-text">
                <h3>Add Product</h3>
                <p>Expand inventory</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">east</span>
            </div>
          </div>
          
          <div class="action-card" @click="router.push(`/vendor/store/${route.params.id}/orders`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">receipt_long</span>
              </div>
              <div class="action-text">
                <h3>Orders Hub</h3>
                <p>Fulfillment center</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">east</span>
            </div>
          </div>

          <div class="action-card" @click="router.push(`/vendor/store/${route.params.id}/marketing`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">campaign</span>
              </div>
              <div class="action-text">
                <h3>Marketing</h3>
                <p>Promote products</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">east</span>
            </div>
          </div>

          <div class="action-card" @click="router.push(`/vendor/store/${route.params.id}/analytics`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">bar_chart</span>
              </div>
              <div class="action-text">
                <h3>Analytics</h3>
                <p>Performance data</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">east</span>
            </div>
          </div>
          
          <div class="action-card" @click="router.push(`/vendor/store/${route.params.id}/team`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">groups</span>
              </div>
              <div class="action-text">
                <h3>Team</h3>
                <p>Manage staff</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">east</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Orders -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">Recent Orders</h2>
          <LiquidButton 
            text="View All Orders" 
            type="ghost" 
            size="xs" 
            @click="router.push(`/vendor/store/${route.params.id}/orders`)" 
          />
        </div>
        
        <div class="orders-viewport">
          <div v-if="loading" class="loading-state">
            <LiquidSpinner />
          </div>
          <div v-else-if="recentOrders.length === 0" class="empty-state">
            <div class="empty-icon-wrap">
                <span class="material-icons-round">shopping_basket</span>
            </div>
            <h3>No Orders Yet</h3>
            <p>Wait for your first transaction to appear here.</p>
          </div>
          <div v-else class="orders-grid">
            <!-- Header for desktop -->
            <div class="grid-header">
              <span>Order ID</span>
              <span>Date</span>
              <span>Status</span>
              <span>Total</span>
              <span class="text-right">Action</span>
            </div>

            <div v-for="order in recentOrders" :key="order.id" class="order-row" @click="router.push(`/vendor/store/${route.params.id}/orders/${order.id}`)">
              <div class="order-id-col">
                <span class="id-symbol">#</span>
                <span class="id-value">{{ order.id.slice(0, 8).toUpperCase() }}</span>
              </div>
              
              <div class="date-col">
                {{ formatFullDate(order.createdAt) }}
              </div>
              
              <div class="status-col">
                <div class="status-badge" :class="order.status">
                  <span class="dot"></span>
                  {{ order.status }}
                </div>
              </div>

              <div class="valuation-col">
                <span class="currency">$</span>
                <span class="amount">{{ order.total?.toFixed(2) }}</span>
              </div>
              
              <div class="action-col">
                <button class="view-btn">
                  <span class="material-icons-round">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidStats from '../components/liquid-ui-kit/LiquidStats/LiquidStats.vue';
import LiquidSpinner from '../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useVendor } from '../composables/useVendor';

const route = useRoute();
const router = useRouter();
const { fetchStoreStats, fetchStoreOrders } = useVendor();

const stats = ref(null);
const recentOrders = ref([]);
const loading = ref(true);

const dashboardStats = computed(() => {
  if (!stats.value) return [];
  return [
    { 
      title: 'Total Revenue', 
      value: `$${stats.value.revenue?.toFixed(2) || '0.00'}`, 
      icon: 'attach_money', 
      iconClass: 'text-success',
      trend: { direction: 'up', label: '+12% vs last month' }
    },
    { 
      title: 'Active Orders', 
      value: stats.value.orders || '0', 
      icon: 'receipt', 
      iconClass: 'text-primary',
      trend: { direction: 'up', label: '+5% vs last week' }
    },
    { 
      title: 'Total Products', 
      value: stats.value.products || '0', 
      icon: 'inventory_2', 
      iconClass: 'text-warning',
      trend: { direction: 'up', label: '+3 new this week' }
    },
    { 
      title: 'Conversion Rate', 
      value: '2.4%', 
      icon: 'analytics', 
      iconClass: 'text-info',
      trend: { direction: 'up', label: '+0.1% vs last month' }
    }
  ];
});

const formatFullDate = (timestamp) => {
  if (!timestamp) return '---';
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
    loading.value = true;
    try {
      stats.value = await fetchStoreStats(storeId);
      recentOrders.value = await fetchStoreOrders(storeId, 5);
    } catch (e) {
      console.error("Pipeline Sync Failure", e);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped src="./StoreDashboardPage.css"></style>
