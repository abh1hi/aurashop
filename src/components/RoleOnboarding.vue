<template>
  <div class="onboarding-container">
    <!-- Dynamic Mesh Background -->
    <div class="background-elements">
      <div class="mesh-blob mesh-1"></div>
      <div class="mesh-blob mesh-2"></div>
      <div class="mesh-blob mesh-3"></div>
    </div>

    <main class="onboarding-content">
      <div class="onboarding-card fade-in">
        <!-- Brand Identity -->
        <header class="card-header">
          <div class="brand-badge">
            <span class="material-icons-round">diamond</span>
            AuraShop Ecosystem
          </div>
          <h1 class="main-title">Join the <span class="gradient-text">Future</span></h1>
          <p class="main-subtitle">Choose your path and start your journey with the most advanced commerce platform.</p>
        </header>

        <!-- Role Selector -->
        <section class="role-selection-section">
          <div class="role-grid">
            <button 
              v-for="role in roles" 
              :key="role.id"
              class="role-card-refined"
              :class="{ active: selectedRole === role.id }"
              @click="selectedRole = role.id"
            >
              <div class="role-icon-outer">
                 <span class="material-icons-round role-icon-inner">{{ role.icon }}</span>
              </div>
              <div class="role-meta">
                <span class="role-name">{{ role.label }}</span>
                <span class="role-tagline">{{ role.description }}</span>
              </div>
              <div class="selection-indicator">
                <span class="material-icons-round">check_circle</span>
              </div>
            </button>
          </div>
        </section>

        <!-- Contextual Setup Form -->
        <transition name="page-fade" mode="out-in">
          <section :key="selectedRole" v-if="selectedRole" class="form-section-refined">
            <div class="setup-header">
              <h3>Setup {{ getRoleLabel(selectedRole) }} Account</h3>
              <p>Just a few more details to get you started.</p>
            </div>
            
            <form @submit.prevent="handleSubmit" class="liquid-form-stack">
              <!-- Vendor Form -->
              <div v-if="selectedRole === 'vendor'" class="form-fields">
                <LiquidInput 
                  v-model="formData.storeName" 
                  placeholder="Official Store Name" 
                  icon="storefront" 
                  class="mb-md" 
                />
                <LiquidInput 
                  v-model="formData.businessEmail" 
                  placeholder="Business Contact Email" 
                  icon="alternate_email" 
                />
              </div>

              <!-- Delivery Partner Form -->
              <div v-if="selectedRole === 'delivery_partner'" class="form-fields">
                <LiquidInput 
                  v-model="formData.vehicleType" 
                  placeholder="Vehicle Type (e.g. Electric Bike)" 
                  icon="electric_moped" 
                  class="mb-md" 
                />
                <LiquidInput 
                  v-model="formData.licenseNumber" 
                  placeholder="Driver's License Number" 
                  icon="badge" 
                />
              </div>

              <!-- Store Manager Form -->
              <div v-if="selectedRole === 'store_manager'" class="form-fields">
                <LiquidInput 
                  v-model="formData.managedStoreId" 
                  placeholder="Enter Store Invitation ID" 
                  icon="vpn_key" 
                />
                <span class="field-hint">Your administrator should provide this ID.</span>
              </div>

              <div class="submit-wrapper mt-xl">
                <LiquidButton 
                  text="Finalize Setup" 
                  type="primary" 
                  size="lg" 
                  class="w-100"
                  :loading="loading"
                  icon="rocket_launch"
                />
              </div>
            </form>
          </section>
        </transition>
      </div>
    </main>

    <!-- Footer Meta -->
    <footer class="onboarding-meta">
      <p>&copy; 2024 AuraShop. Enterprise Grade Security Verified.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
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
    description: 'Launch your digital store'
  },
  { 
    id: 'delivery_partner', 
    label: 'Delivery', 
    icon: 'electric_bike',
    description: 'Grow the logistics network'
  },
  { 
    id: 'store_manager', 
    label: 'Manager', 
    icon: 'engineering',
    description: 'Operational store control'
  }
];

const formData = reactive({
  storeName: '',
  businessEmail: '',
  vehicleType: '',
  licenseNumber: '',
  managedStoreId: ''
});

const getRoleLabel = (roleId: string) => {
  return roles.find(r => r.id === roleId)?.label || '';
};

const handleSubmit = async () => {
  if (loading.value) return;
  loading.value = true;
  
  try {
    if (selectedRole.value === 'vendor') {
      if (!formData.storeName) {
        showToast('Store name is required', 'warning');
        loading.value = false;
        return;
      }
      
      await becomeVendor();
      const storeId = await createStore({ name: formData.storeName });
      showToast('Welcome to the seller community! 🚀', 'success');
      router.push(`/vendor/store/${storeId}/onboarding`);
      return;
    } 
    
    let metadata = {};
    if (selectedRole.value === 'delivery_partner') {
      if (!formData.licenseNumber) throw new Error('License number is required');
      metadata = { vehicleType: formData.vehicleType, licenseNumber: formData.licenseNumber };
    } else if (selectedRole.value === 'store_manager') {
      if (!formData.managedStoreId) throw new Error('Store ID is required');
      metadata = { managedStoreId: formData.managedStoreId, permissions: ['view_orders'] };
    }

    await addRole(selectedRole.value, metadata);
    showToast('Role updated successfully! Welcome.', 'success');
    router.push('/profile');
    
  } catch (error: any) {
    console.error('[RoleOnboarding] Submission error:', error);
    showToast(error.message || 'Verification failed. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.onboarding-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-color);
    position: relative;
    overflow-x: hidden;
    padding: calc(var(--header-height) + 40px) 20px 60px;
}

/* Mesh Background */
.background-elements {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
}

.mesh-blob {
    position: absolute;
    filter: blur(100px);
    opacity: 0.12;
    border-radius: 50%;
}

.mesh-1 { width: 500px; height: 500px; top: -100px; right: -100px; background: var(--brand-primary); }
.mesh-2 { width: 400px; height: 400px; bottom: -50px; left: -50px; background: var(--brand-secondary); }
.mesh-3 { width: 300px; height: 300px; top: 40%; left: 30%; background: var(--error-color); }

.onboarding-content {
    position: relative;
    z-index: 1;
    max-width: 600px;
    width: 100%;
    margin: auto;
}

.onboarding-card {
    background: var(--liquid-glass-base);
    backdrop-filter: blur(var(--liquid-blur)) saturate(var(--liquid-saturate));
    -webkit-backdrop-filter: blur(var(--liquid-blur)) saturate(var(--liquid-saturate));
    border: 1px solid var(--liquid-glass-border);
    border-radius: var(--radius-2xl);
    padding: 40px;
    box-shadow: var(--liquid-shadow-lg);
}

.card-header {
    text-align: center;
    margin-bottom: 40px;
}

.brand-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    background: color-mix(in srgb, var(--brand-primary) 10%, transparent);
    color: var(--brand-primary);
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 24px;
}

.main-title {
    font-size: var(--text-3xl);
    font-weight: 900;
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 16px;
    color: var(--primary-text);
}

.gradient-text {
    background: linear-gradient(135deg, var(--brand-primary), var(--brand-secondary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
}

.main-subtitle {
    color: var(--secondary-text);
    font-size: var(--text-base);
    line-height: 1.6;
    max-width: 400px;
    margin: 0 auto;
}

/* Role Selection Grid */
.role-grid {
    display: grid;
    gap: 16px;
    margin-bottom: 40px;
}

.role-card-refined {
    background: var(--liquid-glass-shine-1);
    border: 1px solid var(--liquid-glass-border);
    border-radius: var(--radius-xl);
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 20px;
    width: 100%;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    position: relative;
    text-align: left;
}

.role-card-refined:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: var(--brand-primary);
    background: var(--liquid-glass-base);
    box-shadow: var(--liquid-shadow-lg);
}

.role-card-refined.active {
    background: var(--bg-color);
    border-color: var(--brand-primary);
    box-shadow: inset 0 0 0 1px var(--brand-primary);
}

.role-icon-outer {
    width: 52px;
    height: 52px;
    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--brand-primary);
    transition: all 0.3s ease;
}

.role-card-refined.active .role-icon-outer {
    background: var(--brand-primary);
    color: white;
}

.role-meta {
    flex: 1;
}

.role-name {
    display: block;
    font-weight: 800;
    font-size: var(--text-base);
    color: var(--primary-text);
    margin-bottom: 2px;
}

.role-tagline {
    font-size: var(--text-xs);
    color: var(--secondary-text);
    font-weight: 500;
}

.selection-indicator {
    opacity: 0;
    transform: scale(0.5);
    transition: all 0.3s var(--ease-elastic);
    color: var(--brand-primary);
}

.role-card-refined.active .selection-indicator {
    opacity: 1;
    transform: scale(1.2);
}

/* Form Section */
.form-section-refined {
    padding-top: 32px;
    border-top: 1px solid var(--liquid-glass-border);
    animation: slideUp 0.4s var(--ease-out);
}

.setup-header {
    margin-bottom: 24px;
}

.setup-header h3 {
    font-size: var(--text-lg);
    font-weight: 900;
    margin-bottom: 4px;
}

.setup-header p {
    font-size: var(--text-sm);
    color: var(--secondary-text);
}

.field-hint {
    display: block;
    font-size: var(--text-xs);
    color: var(--secondary-text);
    margin-top: 8px;
    padding-left: 4px;
}

.onboarding-meta {
    margin-top: 40px;
    text-align: center;
}

.onboarding-meta p {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
    color: var(--secondary-text);
}

/* Utility Animations */
.fade-in { animation: fadeIn 0.6s ease-out; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.page-fade-enter-active, .page-fade-leave-active {
    transition: all 0.3s ease;
}
.page-fade-enter-from { opacity: 0; transform: translateX(20px); }
.page-fade-leave-to { opacity: 0; transform: translateX(-20px); }

.mb-md { margin-bottom: 16px; }
.mt-xl { margin-top: 32px; }
.w-100 { width: 100%; }
</style>
