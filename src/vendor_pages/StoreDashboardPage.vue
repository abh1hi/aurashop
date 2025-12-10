<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="dashboard-header">
        <h1 class="page-title">Store Dashboard</h1>
        <div class="header-actions">
          <LiquidButton 
            text="Settings" 
            icon="settings" 
            type="ghost" 
            @click="router.push(`/vendor/store/${route.params.id}/settings`)"
          />
          <LiquidButton 
            text="Add Product" 
            icon="add" 
            type="primary" 
            @click="router.push(`/vendor/store/${route.params.id}/add-product`)"
          />
        </div>
      </div>

      <!-- Stats Grid -->
      <LiquidStats :stats="dashboardStats" class="mb-xl" />

      <!-- Quick Actions -->
      <!-- Quick Actions -->
      <section class="dashboard-section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <div class="action-card gradient-1" @click="router.push(`/vendor/store/${route.params.id}/products`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">inventory_2</span>
              </div>
              <div class="action-text">
                <h3>Products</h3>
                <p>Manage your catalog</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">arrow_forward</span>
            </div>
          </div>

          <div class="action-card gradient-2" @click="router.push(`/vendor/store/${route.params.id}/add-product`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">add_box</span>
              </div>
              <div class="action-text">
                <h3>Add Product</h3>
                <p>Create a new listing</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">arrow_forward</span>
            </div>
          </div>
          
          <div class="action-card gradient-3" @click="router.push(`/vendor/store/${route.params.id}/orders`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">shopping_bag</span>
              </div>
              <div class="action-text">
                <h3>Manage Orders</h3>
                <p>Process incoming orders</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">arrow_forward</span>
            </div>
          </div>

          <div class="action-card gradient-4" @click="router.push(`/vendor/store/${route.params.id}/marketing`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">campaign</span>
              </div>
              <div class="action-text">
                <h3>Marketing</h3>
                <p>Promote your store</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">arrow_forward</span>
            </div>
          </div>

          <div class="action-card gradient-1" @click="router.push(`/vendor/store/${route.params.id}/analytics`)">
            <div class="action-content">
              <div class="action-icon">
                <span class="material-icons-round">analytics</span>
              </div>
              <div class="action-text">
                <h3>Analytics</h3>
                <p>View performance</p>
              </div>
            </div>
            <div class="action-arrow">
              <span class="material-icons-round">arrow_forward</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Recent Orders -->
      <section class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">Recent Orders</h2>
          <LiquidButton text="View All" type="ghost" size="sm" @click="router.push(`/vendor/store/${route.params.id}/orders`)" />
        </div>
        
        <div class="orders-container">
          <div v-if="loading" class="loading-state">
            <LiquidSpinner />
          </div>
          <div v-else-if="recentOrders.length === 0" class="empty-state">
            <span class="material-icons-round">inbox</span>
            <p>No orders yet</p>
          </div>
          <div v-else class="orders-table">
            <div class="table-header">
              <div class="col-id">Order ID</div>
              <div class="col-date">Date</div>
              <div class="col-status">Status</div>
              <div class="col-total">Total</div>
              <div class="col-action"></div>
            </div>
            <div v-for="order in recentOrders" :key="order.id" class="table-row" @click="router.push(`/vendor/store/${route.params.id}/orders/${order.id}`)">
              <div class="col-id">
                <span class="id-text">#{{ order.id.slice(0, 8) }}</span>
              </div>
              <div class="col-date">
                {{ new Date(order.createdAt?.seconds * 1000).toLocaleDateString() }}
              </div>
              <div class="col-status">
                <span class="status-pill" :class="order.status">{{ order.status }}</span>
              </div>
              <div class="col-total">
                ${{ order.total?.toFixed(2) }}
              </div>
              <div class="col-action">
                <span class="material-icons-round">chevron_right</span>
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
      trend: { direction: 'up', label: '+12% vs last month' } // Mock trend
    },
    { 
      title: 'Total Orders', 
      value: stats.value.orders || '0', 
      icon: 'shopping_bag', 
      iconClass: 'text-primary',
      trend: { direction: 'up', label: '+5% vs last week' }
    },
    { 
      title: 'Total Views', 
      value: stats.value.views || '0', 
      icon: 'visibility', 
      iconClass: 'text-warning',
      trend: { direction: 'down', label: '-2% vs yesterday' }
    },
    { 
      title: 'Conversion Rate', 
      value: '2.4%', 
      icon: 'trending_up', 
      iconClass: 'text-info',
      trend: { direction: 'up', label: '+0.1% vs last month' }
    }
  ];
});

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
    loading.value = true;
    try {
      stats.value = await fetchStoreStats(storeId);
      recentOrders.value = await fetchStoreOrders(storeId, 5);
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped src="./StoreDashboardPage.css"></style>
