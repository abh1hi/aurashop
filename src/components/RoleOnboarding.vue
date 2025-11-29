<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="role-onboarding">
        <LiquidCard class="onboarding-card">
          <h2 class="title">Join Our Ecosystem</h2>
          <p class="subtitle">Expand your possibilities with AuraShop</p>

          <div class="role-selector">
            <button 
              v-for="role in roles" 
              :key="role.id"
              class="role-btn"
              :class="{ active: selectedRole === role.id }"
              @click="selectedRole = role.id"
            >
              <span class="material-icons">{{ role.icon }}</span>
              {{ role.label }}
            </button>
          </div>

          <form @submit.prevent="handleSubmit" class="onboarding-form" v-if="selectedRole">
            
            <!-- Vendor Form -->
            <div v-if="selectedRole === 'vendor'" class="role-form">
              <h3>Become a Vendor</h3>
              <div class="form-group">
                <LiquidInput v-model="formData.storeName" placeholder="Store Name" icon="store" />
              </div>
              <div class="form-group">
                <LiquidInput v-model="formData.businessEmail" placeholder="Business Email" icon="email" />
              </div>
            </div>

            <!-- Delivery Partner Form -->
            <div v-if="selectedRole === 'delivery_partner'" class="role-form">
              <h3>Become a Delivery Partner</h3>
              <div class="form-group">
                <LiquidInput v-model="formData.vehicleType" placeholder="Vehicle Type (Bike, Car, Van)" icon="directions_car" />
              </div>
              <div class="form-group">
                <LiquidInput v-model="formData.licenseNumber" placeholder="License Number" icon="badge" />
              </div>
            </div>

            <!-- Store Manager Form -->
            <div v-if="selectedRole === 'store_manager'" class="role-form">
              <h3>Become a Store Manager</h3>
              <div class="form-group">
                <LiquidInput v-model="formData.managedStoreId" placeholder="Store ID / Code" icon="qr_code" />
              </div>
              <p class="hint">Ask the store owner for their Store ID.</p>
            </div>

            <LiquidButton 
              text="Submit Application" 
              type="primary" 
              size="lg" 
              class="submit-btn"
              :loading="loading"
            />
          </form>
        </LiquidCard>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import AppHeader from './AppHeader.vue';
import BottomNavBar from './BottomNavBar.vue';
import LiquidInput from './liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidCard from './liquid-ui-kit/LiquidCard/LiquidCard.vue';
import { useUser } from '../composables/useUser';
import { useToast } from './liquid-ui-kit/LiquidToast/LiquidToast.js';

const { addRole } = useUser();
const { showToast } = useToast();
const loading = ref(false);
const selectedRole = ref('vendor');

const roles = [
  { id: 'vendor', label: 'Vendor', icon: 'storefront' },
  { id: 'delivery_partner', label: 'Delivery', icon: 'local_shipping' },
  { id: 'store_manager', label: 'Manager', icon: 'manage_accounts' }
];

const formData = reactive({
  storeName: '',
  businessEmail: '',
  vehicleType: '',
  licenseNumber: '',
  managedStoreId: ''
});

const handleSubmit = async () => {
  loading.value = true;
  try {
    let metadata = {};
    if (selectedRole.value === 'vendor') {
      metadata = { storeName: formData.storeName, businessEmail: formData.businessEmail };
    } else if (selectedRole.value === 'delivery_partner') {
      metadata = { vehicleType: formData.vehicleType, licenseNumber: formData.licenseNumber };
    } else if (selectedRole.value === 'store_manager') {
      metadata = { managedStoreId: formData.managedStoreId, permissions: ['view_orders'] }; // Default permission
    }

    await addRole(selectedRole.value, metadata);
    showToast('Application submitted successfully!', 'success');
    // Reset or redirect
  } catch (error) {
    console.error(error);
    showToast('Error submitting application', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: var(--bg-color);
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-top: var(--spacing-lg);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}

.role-onboarding {
  width: 100%;
  max-width: 600px;
}

.onboarding-card {
  padding: 40px;
}

.title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 8px;
}

.subtitle {
  text-align: center;
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.role-selector {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.role-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
}

.role-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.role-btn.active {
  background: var(--brand-primary);
  color: white;
  border-color: var(--brand-primary);
}

.role-form h3 {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 16px;
}

.hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: -10px;
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
}
</style>
