<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="form-container">
        <LiquidCard class="store-form-card" variant="liquid">
          <h1 class="form-title">Create Your Store</h1>
          <p class="form-subtitle">Tell us about your business</p>

          <form @submit.prevent="handleSubmit" class="store-form">
            <div class="form-group">
              <label>Store Name</label>
              <LiquidInput 
                v-model="formData.name" 
                placeholder="e.g. Urban Threads" 
                required 
              />
            </div>

            <div class="form-group">
              <label>Description</label>
              <LiquidInput 
                v-model="formData.description" 
                placeholder="What do you sell?" 
                required 
              />
            </div>

            <div class="form-group">
              <label>Category</label>
              <LiquidDropdown 
                :options="categories"
                v-model="formData.category"
                placeholder="Select Category"
              />
            </div>

            <div class="form-group">
              <label>Logo URL (Optional)</label>
              <LiquidInput 
                v-model="formData.logoUrl" 
                placeholder="https://..." 
              />
            </div>

            <div class="form-actions">
              <LiquidButton 
                text="Create Store" 
                type="primary" 
                size="lg" 
                :loading="loading"
                submit
              />
            </div>
            
            <p v-if="error" class="error-text">{{ error }}</p>
          </form>
        </LiquidCard>
      </div>
    </main>
    
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue'; // Assuming this exists or using select
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const router = useRouter();
const { createStore, loading, error } = useVendor();
const { showToast } = useToast();

const formData = reactive({
  name: '',
  description: '',
  category: '',
  logoUrl: ''
});

const categories = [
  { label: 'Fashion', value: 'fashion' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Home & Living', value: 'home' },
  { label: 'Beauty', value: 'beauty' }
];

const handleSubmit = async () => {
  if (!formData.name || !formData.description || !formData.category) {
    showToast('Please fill in all required fields', 'warning');
    return;
  }

  try {
    const storeId = await createStore(formData);
    showToast('Store created! Let\'s set it up. 🚀', 'success');
    router.push(`/vendor/store/${storeId}/onboarding`);
  } catch (e) {
    showToast('Failed to create store', 'error');
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
  align-items: center;
  padding: var(--spacing-lg);
}

.form-container {
  width: 100%;
  max-width: 500px;
}

.store-form-card {
  padding: var(--spacing-xl);
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.form-subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xl);
}

.store-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-left: 4px;
}

.form-actions {
  margin-top: var(--spacing-md);
}

.error-text {
  color: var(--danger-color);
  text-align: center;
  font-size: 14px;
}
</style>
