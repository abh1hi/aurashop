<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">arrow_back</span>
        Back to Dashboard
      </div>

      <div class="page-header">
        <h1 class="page-title">Marketing</h1>
        <div class="header-actions">
           <LiquidButton 
            text="Create Campaign" 
            icon="add" 
            type="primary" 
          />
        </div>
      </div>

      <!-- Marketing Stats -->
      <LiquidStats :stats="marketingStats" class="mb-xl" />

      <!-- Active Campaigns -->
      <section class="marketing-section">
        <div class="section-header">
          <h2 class="section-title">Active Campaigns</h2>
          <LiquidButton text="View All" type="ghost" size="sm" />
        </div>

        <div class="campaigns-grid">
          <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
            <div class="campaign-image">
              <span class="material-icons-round">local_offer</span>
            </div>
            <div class="campaign-content">
              <div class="campaign-badge" :class="campaign.status">{{ campaign.status }}</div>
              <h3>{{ campaign.name }}</h3>
              <p>{{ campaign.description }}</p>
              <div class="campaign-meta">
                <span><i class="material-icons-round">calendar_today</i> {{ campaign.endDate || 'Ongoing' }}</span>
                <span><i class="material-icons-round">people</i> {{ campaign.reach || 0 }} reached</span>
              </div>
            </div>
            <div class="campaign-actions">
              <button class="icon-btn"><span class="material-icons-round">edit</span></button>
              <button class="icon-btn"><span class="material-icons-round">pause</span></button>
            </div>
          </div>

          <!-- Add New Card -->
          <div class="campaign-card add-new">
            <div class="add-icon">
              <span class="material-icons-round">add</span>
            </div>
            <h3>New Campaign</h3>
            <p>Boost your sales</p>
          </div>
        </div>
      </section>

      <!-- Coupons -->
      <section class="marketing-section">
        <div class="section-header">
          <h2 class="section-title">Coupons</h2>
          <LiquidButton text="Create Coupon" type="ghost" size="sm" icon="add" @click="handleCreateCoupon" />
        </div>

        <div class="coupons-list">
          <div v-if="coupons.length === 0" class="empty-state">
            <p>No coupons created yet.</p>
          </div>

          <div v-for="coupon in coupons" :key="coupon.id" class="coupon-item">
            <div class="coupon-code">{{ coupon.code }}</div>
            <div class="coupon-details">
              <span class="discount">{{ coupon.discount }}</span>
              <span class="usage">Used {{ coupon.usageCount || 0 }} times</span>
            </div>
            <div class="coupon-status" :class="coupon.status">{{ coupon.status }}</div>
            <button class="icon-btn delete" @click="handleDeleteCoupon(coupon.id)">
              <span class="material-icons-round">delete</span>
            </button>
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
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const router = useRouter();
const route = useRoute();
const { showToast } = useToast();
const { fetchCampaigns, fetchCoupons, createCoupon, deleteCoupon, loading } = useMarketing();

const campaigns = ref([]);
const coupons = ref([]);

const marketingStats = [
  { 
    title: 'Campaign Reach', 
    value: '12.5k', 
    icon: 'campaign', 
    iconClass: 'text-primary',
    trend: { direction: 'up', label: '+15% this month' }
  },
  { 
    title: 'Click Rate', 
    value: '3.2%', 
    icon: 'touch_app', 
    iconClass: 'text-info',
    trend: { direction: 'up', label: '+0.4% vs avg' }
  },
  { 
    title: 'Conversions', 
    value: '450', 
    icon: 'shopping_cart', 
    iconClass: 'text-success',
    trend: { direction: 'up', label: '+12% from ads' }
  },
  { 
    title: 'Ad Spend', 
    value: '$120', 
    icon: 'attach_money', 
    iconClass: 'text-warning',
    trend: { direction: 'down', label: 'Under budget' }
  }
];

const loadData = async () => {
  const storeId = route.params.id;
  if (storeId) {
    campaigns.value = await fetchCampaigns(storeId);
    coupons.value = await fetchCoupons(storeId);
  }
};

const handleCreateCoupon = async () => {
  // Placeholder for modal/form
  const code = prompt('Enter Coupon Code:');
  if (code) {
    try {
      await createCoupon(route.params.id, {
        code: code.toUpperCase(),
        discount: '10%',
        type: 'percentage'
      });
      showToast('Coupon created!', 'success');
      loadData();
    } catch (e) {
      showToast('Failed to create coupon', 'error');
    }
  }
};

const handleDeleteCoupon = async (id) => {
  if (confirm('Are you sure?')) {
    try {
      await deleteCoupon(id);
      coupons.value = coupons.value.filter(c => c.id !== id);
      showToast('Coupon deleted', 'success');
    } catch (e) {
      showToast('Failed to delete coupon', 'error');
    }
  }
};

onMounted(loadData);
</script>

<style scoped src="./StoreMarketingPage.css"></style>
