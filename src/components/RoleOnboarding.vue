<template>
  <div class="onboarding-page">
    <!-- Background/Illustration Section -->
    <div class="illustration-section">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="illustration-content">
        <h1 class="hero-title">Welcome to <br/>AuraShop</h1>
        <p class="hero-subtitle">Join the future of commerce.</p>
      </div>
    </div>

    <!-- Content Section -->
    <div class="content-section">
      <div class="content-wrapper">
        <div class="header-area">
          <h2 class="section-title">Choose your path</h2>
          <p class="section-subtitle">How would you like to participate?</p>
        </div>

        <!-- Role Selection -->
        <div class="role-grid">
          <button 
            v-for="role in roles" 
            :key="role.id"
            class="role-card"
            :class="{ active: selectedRole === role.id }"
            @click="selectedRole = role.id"
          >
            <div class="role-icon-wrapper">
              <span class="material-icons-round role-icon">{{ role.icon }}</span>
            </div>
            <span class="role-label">{{ role.label }}</span>
            <span class="role-desc">{{ role.description }}</span>
            <div class="check-mark" v-if="selectedRole === role.id">
              <span class="material-icons-round">check_circle</span>
            </div>
          </button>
        </div>

        <!-- Dynamic Form -->
        <transition name="fade-slide" mode="out-in">
          <div :key="selectedRole" class="form-container" v-if="selectedRole">
            <div class="form-header">
              <h3>{{ getRoleTitle(selectedRole) }}</h3>
            </div>
            
            <form @submit.prevent="handleSubmit" class="onboarding-form">
              <!-- Vendor Form -->
              <div v-if="selectedRole === 'vendor'" class="role-inputs">
                <LiquidInput v-model="formData.storeName" placeholder="Store Name" icon="store" class="mb-4" />
                <LiquidInput v-model="formData.businessEmail" placeholder="Business Email" icon="email" class="mb-4" />
              </div>

              <!-- Delivery Partner Form -->
              <div v-if="selectedRole === 'delivery_partner'" class="role-inputs">
                <LiquidInput v-model="formData.vehicleType" placeholder="Vehicle Type (Bike, Car)" icon="directions_car" class="mb-4" />
                <LiquidInput v-model="formData.licenseNumber" placeholder="License Number" icon="badge" class="mb-4" />
              </div>

              <!-- Store Manager Form -->
              <div v-if="selectedRole === 'store_manager'" class="role-inputs">
                <LiquidInput v-model="formData.managedStoreId" placeholder="Store ID" icon="qr_code" class="mb-4" />
                <p class="hint">Ask the store owner for their Store ID.</p>
              </div>

              <LiquidButton 
                text="Continue" 
                type="primary" 
                size="lg" 
                class="submit-btn"
                :loading="loading"
                icon="arrow_forward"
              />
            </form>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import LiquidInput from './liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useUser } from '../composables/useUser';
import { useVendor } from '../composables/useVendor';
import { useToast } from './liquid-ui-kit/LiquidToast/LiquidToast';

const router = useRouter();
const { addRole } = useUser();
const { becomeVendor, createStore } = useVendor();
const { showToast } = useToast();
const loading = ref(false);
const selectedRole = ref('vendor');

const roles = [
  { 
    id: 'vendor', 
    label: 'Vendor', 
    icon: 'storefront',
    description: 'Sell products & manage your store'
  },
  { 
    id: 'delivery_partner', 
    label: 'Delivery', 
    icon: 'local_shipping',
    description: 'Deliver orders & earn money'
  },
  { 
    id: 'store_manager', 
    label: 'Manager', 
    icon: 'manage_accounts',
    description: 'Help manage an existing store'
  }
];

const formData = reactive({
  storeName: '',
  businessEmail: '',
  vehicleType: '',
  licenseNumber: '',
  managedStoreId: ''
});

const getRoleTitle = (roleId) => {
  const role = roles.find(r => r.id === roleId);
  return role ? `Setup ${role.label} Profile` : 'Setup Profile';
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    if (selectedRole.value === 'vendor') {
      if (!formData.storeName) {
        showToast('Please enter a store name', 'warning');
        loading.value = false;
        return;
      }
      
      await becomeVendor();
      const storeId = await createStore({ name: formData.storeName });
      
      showToast('Welcome aboard! Let\'s set up your store. 🚀', 'success');
      router.push(`/vendor/store/${storeId}/onboarding`);
      return;
    } 
    
    let metadata = {};
    if (selectedRole.value === 'delivery_partner') {
      metadata = { vehicleType: formData.vehicleType, licenseNumber: formData.licenseNumber };
    } else if (selectedRole.value === 'store_manager') {
      metadata = { managedStoreId: formData.managedStoreId, permissions: ['view_orders'] };
    }

    await addRole(selectedRole.value, metadata);
    showToast('Application submitted successfully!', 'success');
    router.push('/profile');
    
  } catch (error) {
    console.error(error);
    showToast('Error submitting application', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.onboarding-page {
  display: flex;
  min-height: 100vh;
  background: #fff;
  overflow: hidden;
}

/* Illustration Section */
.illustration-section {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
  padding: 40px;
}

.floating-shapes .shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
}

.shape-1 { width: 300px; height: 300px; top: -50px; left: -50px; animation: float 10s infinite ease-in-out; }
.shape-2 { width: 200px; height: 200px; bottom: 50px; right: -20px; animation: float 12s infinite ease-in-out reverse; }
.shape-3 { width: 150px; height: 150px; top: 40%; left: 60%; animation: float 8s infinite ease-in-out; }

.illustration-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

.hero-title {
  font-size: 4rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
  text-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.hero-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
}

/* Content Section */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px 60px;
  background: #f8f9fa;
  overflow-y: auto;
}

.content-wrapper {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
}

.header-area {
  margin-bottom: 32px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

/* Role Grid */
.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.role-card {
  background: white;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 4px 6px rgba(0,0,0,0.02);
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(0,0,0,0.05);
}

.role-card.active {
  border-color: var(--primary-color);
  background: rgba(var(--primary-rgb), 0.05);
}

.role-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f0f2f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: background 0.3s;
}

.role-card.active .role-icon-wrapper {
  background: var(--primary-color);
  color: white;
}

.role-icon {
  font-size: 24px;
  color: var(--text-secondary);
}

.role-card.active .role-icon {
  color: white;
}

.role-label {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
  color: var(--text-color);
}

.role-desc {
  font-size: 0.8rem;
  color: var(--text-tertiary);
  line-height: 1.3;
}

.check-mark {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--primary-color);
  font-size: 20px;
}

/* Form */
.form-container {
  background: white;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.form-header h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--text-color);
}

.mb-4 {
  margin-bottom: 16px;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}

.hint {
  font-size: 0.85rem;
  color: var(--text-tertiary);
  margin-top: -12px;
  margin-bottom: 16px;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(0, 20px); }
}

/* Responsive */
@media (max-width: 768px) {
  .onboarding-page {
    flex-direction: column;
  }

  .illustration-section {
    flex: 0 0 35%;
    padding: 20px;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }

  .hero-title { font-size: 2.5rem; }
  .hero-subtitle { font-size: 1.1rem; }

  .content-section {
    flex: 1;
    padding: 30px 20px;
    background: white;
    margin-top: -20px;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    z-index: 20;
  }

  .role-grid {
    grid-template-columns: 1fr;
  }
  
  .role-card {
    flex-direction: row;
    text-align: left;
    padding: 16px;
  }
  
  .role-icon-wrapper {
    margin-bottom: 0;
    margin-right: 16px;
  }
  
  .role-info {
    flex: 1;
  }
}
</style>
