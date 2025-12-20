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
        Back to Protocols
      </div>

      <div v-if="loading" class="loading-state">
        <LiquidSpinner />
      </div>

      <div v-else-if="!order" class="empty-state">
        <span class="material-icons-round">description</span>
        <h3>Order Record Not Found</h3>
        <p>The requested order identifier does not exist in the pipeline.</p>
      </div>

      <div v-else class="order-details-layout">
        <div class="layout-main">
          <!-- Order Summary Card -->
          <section class="glass-panel summary-section">
            <div class="panel-header">
              <div class="order-id-badge">
                <span class="symbol">#</span>
                <span class="id">{{ order.id.slice(0, 8).toUpperCase() }}</span>
              </div>
              <div class="status-badge" :class="order.status">
                <span class="dot"></span>
                {{ order.status }}
              </div>
            </div>
            
            <div class="summary-grid">
              <div class="summary-item">
                <span class="label">Initiated</span>
                <span class="value">{{ formatDate(order.createdAt) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Total Valuation</span>
                <span class="value emphasis">${{ order.total?.toFixed(2) }}</span>
              </div>
              <div class="summary-item">
                <span class="label">Logistics</span>
                <span class="value">{{ order.shippingMethod || 'Standard Delivery' }}</span>
              </div>
            </div>
          </section>

          <!-- Line Items Section -->
          <section class="glass-panel items-section">
            <h3 class="section-title">Line Items Inventory</h3>
            <div class="items-list">
              <div v-for="item in order.items" :key="item.id" class="line-item">
                <div class="item-visual">
                  <img v-if="item.image" :src="item.image" :alt="item.name" />
                  <div v-else class="placeholder">
                    <span class="material-icons-round">inventory_2</span>
                  </div>
                </div>
                <div class="item-data">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-meta">{{ item.variantName || 'Base Configuration' }}</p>
                </div>
                <div class="item-quant">
                  <span class="mult">x</span> {{ item.quantity }}
                </div>
                <div class="item-price">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
            
            <div class="summary-totals">
              <div class="total-row">
                <span>Subtotal Value</span>
                <span>${{ (order.total - (order.shippingPrice || 0)).toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>Logistics Fee</span>
                <span>${{ (order.shippingPrice || 0).toFixed(2) }}</span>
              </div>
              <div class="total-row final">
                <span>Total Settlement</span>
                <span>${{ order.total?.toFixed(2) }}</span>
              </div>
            </div>
          </section>
        </div>

        <aside class="layout-sidebar">
          <!-- Customer Intelligence Card -->
          <section class="glass-panel customer-section">
            <h3 class="section-title">Customer Identity</h3>
            <div class="customer-profile">
              <div class="avatar-lg">
                {{ (order.customerName || 'G')[0].toUpperCase() }}
              </div>
              <div class="profile-text">
                <h4 class="name">{{ order.customerName || 'Anonymous Guest' }}</h4>
                <p class="email">{{ order.customerEmail || 'No Email Linked' }}</p>
              </div>
            </div>
            
            <div class="shipping-info mt-lg">
              <h5 class="mini-title">Destination Protocol</h5>
              <div class="address-block">
                <span class="material-icons-round">location_on</span>
                <p v-if="order.shippingAddress">
                  {{ order.shippingAddress.line1 }}<br />
                  {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }} {{ order.shippingAddress.zip }}
                </p>
                <p v-else>No address data available.</p>
              </div>
            </div>
          </section>

          <!-- Protocol Timeline -->
          <section class="glass-panel timeline-section">
            <h3 class="section-title">Protocol History</h3>
            <div class="timeline">
              <div v-for="(event, index) in timelineEvents" :key="index" class="timeline-item" :class="{ active: index === 0 }">
                <div class="timeline-icon">
                  <span class="material-icons-round">{{ getTimelineIcon(event.status) }}</span>
                </div>
                <div class="timeline-content">
                  <p class="event-status">{{ event.status.replace('_', ' ') }}</p>
                  <p class="event-time">{{ formatFullTime(event.time) }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Action Control -->
          <section class="action-card">
            <h3 class="section-title">Protocol Control</h3>
            <div class="action-buttons">
              <LiquidButton 
                v-if="order.status === 'pending'"
                text="Authorize Processing" 
                type="primary" 
                @click="updateStatus('processing')" 
              />
              <LiquidButton 
                v-if="order.status === 'processing'"
                text="Sync Completion" 
                type="primary" 
                @click="updateStatus('completed')" 
              />
              <LiquidButton 
                v-if="['pending', 'processing'].includes(order.status)"
                text="Void Protocol" 
                type="danger" 
                @click="updateStatus('cancelled')" 
              />
            </div>
          </section>
        </aside>
      </div>
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
import LiquidSpinner from '../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const route = useRoute();
const router = useRouter();
const { getOrder, updateOrderStatus } = useVendor();
const { showToast } = useToast();

const loading = ref(true);
const order = ref(null);

const timelineEvents = computed(() => {
  if (!order.value) return [];
  // Mocking timeline if not present in data
  const events = [];
  if (order.value.createdAt) events.push({ status: 'initiated', time: order.value.createdAt });
  if (order.value.processedAt) events.push({ status: 'processing_start', time: order.value.processedAt });
  if (order.value.completedAt) events.push({ status: 'fully_deployed', time: order.value.completedAt });
  if (order.value.cancelledAt) events.push({ status: 'voided', time: order.value.cancelledAt });
  
  return events.sort((a, b) => {
      const timeA = a.time.seconds || new Date(a.time).getTime() / 1000;
      const timeB = b.time.seconds || new Date(b.time).getTime() / 1000;
      return timeB - timeA;
  });
});

const getTimelineIcon = (status) => {
    switch(status) {
        case 'initiated': return 'flag';
        case 'processing_start': return 'settings_suggest';
        case 'fully_deployed': return 'check_circle';
        case 'voided': return 'cancel';
        default: return 'radio_button_checked';
    }
};

const formatDate = (timestamp) => {
  if (!timestamp) return '---';
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric'
  });
};

const formatFullTime = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const updateStatus = async (newStatus) => {
  try {
    await updateOrderStatus(order.value.id, newStatus);
    order.value.status = newStatus;
    showToast(`Protocol status updated to ${newStatus}`, 'success');
  } catch (e) {
    showToast('Status synchronization failure', 'error');
  }
};

onMounted(async () => {
  const orderId = route.params.orderId;
  if (orderId) {
    loading.value = true;
    try {
      order.value = await getOrder(orderId);
    } catch (e) {
      console.error("Order Record Sync Failure", e);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<style scoped src="./StoreOrderDetailsPage.css"></style>
