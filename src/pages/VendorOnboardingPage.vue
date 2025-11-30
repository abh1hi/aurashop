<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="onboarding-container">
        <div class="hero-section">
          <h1 class="title">Start Selling on AuraShop</h1>
          <p class="subtitle">Join thousands of vendors and reach millions of customers today.</p>
          
          <div class="features-grid">
            <LiquidCard class="feature-card" variant="glass">
              <span class="material-icons-round feature-icon">storefront</span>
              <h3>Create Your Store</h3>
              <p>Customize your storefront and showcase your brand.</p>
            </LiquidCard>
            
            <LiquidCard class="feature-card" variant="glass">
              <span class="material-icons-round feature-icon">payments</span>
              <h3>Fast Payments</h3>
              <p>Get paid directly to your bank account securely.</p>
            </LiquidCard>
            
            <LiquidCard class="feature-card" variant="glass">
              <span class="material-icons-round feature-icon">analytics</span>
              <h3>Real-time Analytics</h3>
              <p>Track your sales and growth with detailed insights.</p>
            </LiquidCard>
          </div>

          <div class="action-area">
            <LiquidButton 
              text="Start Selling Now" 
              type="primary" 
              size="lg" 
              icon="rocket_launch"
              :loading="loading"
              @click="handleStartSelling"
            />
            <p v-if="error" class="error-text">{{ error }}</p>
          </div>
        </div>
      </div>
    </main>
    
    <BottomNavBar />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const router = useRouter();
const { becomeVendor, loading, error } = useVendor();
const { showToast } = useToast();

const handleStartSelling = async () => {
  try {
    await becomeVendor();
    showToast('Welcome to the Vendor Program! 🎉', 'success');
    router.push('/vendor/create-store');
  } catch (e) {
    showToast('Failed to join vendor program', 'error');
  }
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-lg);
}

.onboarding-container {
  max-width: 1000px;
  width: 100%;
  text-align: center;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.feature-card {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.feature-icon {
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.error-text {
  color: var(--danger-color);
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
}
</style>
