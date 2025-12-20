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
        <h1 class="page-title">Marketing Core</h1>
        <div class="header-actions">
           <LiquidButton 
            text="Global Campaign" 
            icon="rocket_launch" 
            type="primary" 
            size="sm"
          />
        </div>
      </div>

      <!-- Marketing Stats -->
      <LiquidStats :stats="marketingStats" class="mb-xl" />

      <!-- Active Campaigns -->
      <section class="marketing-section">
        <div class="section-header">
          <h2 class="section-title">Active Protocols</h2>
          <LiquidButton text="Archive" type="ghost" size="xs" />
        </div>

        <div class="campaigns-grid">
          <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
            <div class="campaign-visual">
              <div class="visual-blob"></div>
              <span class="material-icons-round">auto_awesome</span>
            </div>
            
            <div class="campaign-info">
              <div class="info-header">
                <div class="status-chip" :class="campaign.status">
                  <span class="dot"></span>
                  {{ campaign.status }}
                </div>
                <h3 class="text-truncate">{{ campaign.name }}</h3>
              </div>
              
              <p class="campaign-desc">{{ campaign.description }}</p>
              
              <div class="campaign-metrics">
                <div class="metric-pill">
                  <span class="material-icons-round">event</span>
                  {{ campaign.endDate || 'Active' }}
                </div>
                <div class="metric-pill">
                  <span class="material-icons-round">sensors</span>
                  {{ campaign.reach || 0 }} Reach
                </div>
              </div>
            </div>

            <div class="campaign-controls">
              <button class="control-btn"><span class="material-icons-round">edit_note</span></button>
              <button class="control-btn"><span class="material-icons-round">pause_circle</span></button>
            </div>
          </div>

          <!-- Add New Card -->
          <div class="campaign-card add-new" @click="handleCreateCampaign">
            <div class="add-visual">
              <span class="material-icons-round">add</span>
            </div>
            <div class="add-text">
                <h3>New Pipeline</h3>
                <p>Initialize growth protocol</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Coupons -->
      <section class="marketing-section">
        <div class="section-header">
          <h2 class="section-title">Incentive Nodes</h2>
          <LiquidButton text="Generate Code" type="ghost" size="xs" icon="qr_code_2" @click="handleCreateCoupon" />
        </div>

        <div class="coupons-viewport">
          <div v-if="coupons.length === 0" class="empty-state">
            <div class="empty-icon-wrap">
                <span class="material-icons-round">confirmation_number</span>
            </div>
            <h3>No Active Nodes</h3>
            <p>Generate incentive codes to boost conversion velocity.</p>
          </div>

          <div class="coupons-grid" v-else>
            <div v-for="coupon in coupons" :key="coupon.id" class="coupon-node">
              <div class="node-main">
                <div class="code-wrap">
                    <span class="label">CODE</span>
                    <span class="code">{{ coupon.code }}</span>
                </div>
                <div class="details-wrap">
                  <span class="benefit">{{ coupon.discount }} Discount</span>
                  <span class="usage">{{ coupon.usageCount || 0 }} Syncs</span>
                </div>
              </div>
              
              <div class="node-side">
                <div class="node-status" :class="coupon.status">{{ coupon.status }}</div>
                <button class="delete-node" @click="handleDeleteCoupon(coupon.id)">
                  <span class="material-icons-round">close</span>
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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidStats from '../components/liquid-ui-kit/LiquidStats/LiquidStats.vue';
import { useMarketing } from '../composables/useMarketing';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const router = useRouter();
const route = useRoute();
const { showToast } = useToast();
const { fetchCampaigns, fetchCoupons, createCoupon, deleteCoupon, loading } = useMarketing();

const campaigns = ref([]);
const coupons = ref([]);

const marketingStats = [
  { 
    title: 'Market Reach', 
    value: '12.5k', 
    icon: 'hub', 
    iconClass: 'text-primary',
    trend: { direction: 'up', label: '+15% Epoch' }
  },
  { 
    title: 'Interaction Rate', 
    value: '3.2%', 
    icon: 'ads_click', 
    iconClass: 'text-info',
    trend: { direction: 'up', label: '+0.4% Avg' }
  },
  { 
    title: 'Conversions', 
    value: '450', 
    icon: 'track_changes', 
    iconClass: 'text-success',
    trend: { direction: 'up', label: '+12% Ads' }
  },
  { 
    title: 'Ad Budget', 
    value: '$120', 
    icon: 'payments', 
    iconClass: 'text-warning',
    trend: { direction: 'down', label: 'Optimized' }
  }
];

const loadData = async () => {
  const storeId = route.params.id;
  if (storeId) {
    try {
        const [c, cp] = await Promise.all([
            fetchCampaigns(storeId),
            fetchCoupons(storeId)
        ]);
        campaigns.value = c;
        coupons.value = cp;
    } catch (e) {
        showToast('Sync failure', 'error');
    }
  }
};

const handleCreateCampaign = () => {
    showToast('Campaign module initializing...', 'info');
};

const handleCreateCoupon = async () => {
  const code = prompt('Enter Protocol Code:');
  if (code) {
    try {
      await createCoupon(route.params.id, {
        code: code.toUpperCase(),
        discount: '10%',
        type: 'percentage'
      });
      showToast('Protocol active!', 'success');
      loadData();
    } catch (e) {
      showToast('Node creation failed', 'error');
    }
  }
};

const handleDeleteCoupon = async (id) => {
  if (confirm('Terminate protocol?')) {
    try {
      await deleteCoupon(id);
      coupons.value = coupons.value.filter(c => c.id !== id);
      showToast('Protocol terminated', 'success');
    } catch (e) {
      showToast('Termination failure', 'error');
    }
  }
};

onMounted(loadData);
</script>

<style scoped src="./StoreMarketingPage.css"></style>
