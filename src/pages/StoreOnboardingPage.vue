<template>
  <div class="onboarding-page">
    <!-- Left Panel: Progress & Info -->
    <div class="info-panel">
      <div class="panel-content">
        <div class="brand-logo">
          <span class="material-icons-round">storefront</span>
          <span>AuraShop</span>
        </div>
        
        <div class="step-indicator">
          <div class="step-text">
            <span class="step-number">Step {{ currentStep }}</span>
            <span class="step-total">of {{ totalSteps }}</span>
          </div>
          <h2 class="step-heading">{{ getStepTitle(currentStep) }}</h2>
          <p class="step-desc">{{ getStepDescription(currentStep) }}</p>
        </div>

        <div class="progress-container">
          <div 
            v-for="step in totalSteps" 
            :key="step"
            class="progress-segment"
            :class="{ active: step <= currentStep, current: step === currentStep }"
          ></div>
        </div>
      </div>
      
      <div class="panel-decoration">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
      </div>
    </div>

    <!-- Right Panel: Form -->
    <div class="form-panel">
      <div class="form-wrapper">
        <transition name="slide-fade" mode="out-in">
          <div :key="currentStep" class="step-container">
            
            <!-- Step 1: Welcome -->
            <div v-if="currentStep === 1" class="step-content center-content">
              <div class="illustration-icon">🚀</div>
              <h1>Let's build your store</h1>
              <p>You're just a few steps away from reaching millions of customers.</p>
              <LiquidButton text="Start Setup" type="primary" size="lg" @click="nextStep" class="mt-8" />
            </div>

            <!-- Step 2: Basics -->
            <div v-if="currentStep === 2" class="step-content">
              <div class="input-group">
                <label>Store Name</label>
                <LiquidInput v-model="formData.name" placeholder="e.g. Urban Threads" icon="store" />
              </div>
              <div class="input-group">
                <label>Phone Number</label>
                <LiquidInput v-model="formData.phone" placeholder="+1234567890" icon="phone" />
                <div class="verification-badge" :class="{ verified: isPhoneVerified }">
                  <span class="material-icons-round">{{ isPhoneVerified ? 'check_circle' : 'info' }}</span>
                  {{ isPhoneVerified ? 'Verified from account' : 'Verification required later' }}
                </div>
              </div>
            </div>

            <!-- Step 3: KYC -->
            <div v-if="currentStep === 3" class="step-content">
              <div class="upload-zone" @click="triggerFileUpload" :class="{ 'has-file': kycFile }">
                <div class="upload-content">
                  <span class="material-icons-round icon">cloud_upload</span>
                  <h3>{{ kycFile ? kycFile.name : 'Upload ID Document' }}</h3>
                  <p>{{ kycFile ? 'Click to change' : 'Passport, Driving License, or National ID' }}</p>
                </div>
                <input type="file" ref="fileInput" @change="handleFileChange" hidden accept="image/*,.pdf" />
              </div>
            </div>

            <!-- Step 4: Category -->
            <div v-if="currentStep === 4" class="step-content">
              <div class="category-select-container">
                <LiquidDropdown 
                  v-model="formData.category" 
                  :options="categoryOptions" 
                  placeholder="Select a category"
                  label="Primary Category"
                />
              </div>
              <p class="helper-text">Choose the category that best describes your products.</p>
            </div>

            <!-- Step 5: Details -->
            <div v-if="currentStep === 5" class="step-content">
              <div class="input-group">
                <label>Address</label>
                <LiquidInput v-model="formData.address" placeholder="Street Address" icon="location_on" />
              </div>
              <div class="row">
                <div class="input-group">
                  <label>City</label>
                  <LiquidInput v-model="formData.city" placeholder="City" />
                </div>
                <div class="input-group">
                  <label>Hours</label>
                  <LiquidInput v-model="formData.hours" placeholder="9 AM - 5 PM" />
                </div>
              </div>
            </div>

            <!-- Step 6: Bank -->
            <div v-if="currentStep === 6" class="step-content">
              <div class="input-group">
                <label>Account Holder</label>
                <LiquidInput v-model="formData.bankName" placeholder="Name on Account" icon="person" />
              </div>
              <div class="input-group">
                <label>Account Number</label>
                <LiquidInput v-model="formData.accountNumber" placeholder="0000 0000 0000" icon="account_balance" />
              </div>
              <div class="input-group">
                <label>IFSC / Routing</label>
                <LiquidInput v-model="formData.ifsc" placeholder="Bank Code" icon="code" />
              </div>
            </div>

            <!-- Step 7: Branding -->
            <div v-if="currentStep === 7" class="step-content">
              <div class="input-group">
                <label>Description</label>
                <LiquidInput v-model="formData.description" placeholder="Tell us about your store..." icon="description" />
              </div>
              <div class="input-group">
                <label>Logo URL</label>
                <LiquidInput v-model="formData.logoUrl" placeholder="https://..." icon="image" />
              </div>
              <div class="input-group">
                <label>Banner URL</label>
                <LiquidInput v-model="formData.bannerUrl" placeholder="https://..." icon="panorama" />
              </div>
            </div>

            <!-- Step 8: Review -->
            <div v-if="currentStep === 8" class="step-content">
              <div class="review-card">
                <h3>{{ formData.name }}</h3>
                <div class="review-item">
                  <span class="label">Category</span>
                  <span class="value">{{ getCategoryName(formData.category) }}</span>
                </div>
                <div class="review-item">
                  <span class="label">Phone</span>
                  <span class="value">{{ formData.phone }}</span>
                </div>
                <div class="review-item">
                  <span class="label">City</span>
                  <span class="value">{{ formData.city }}</span>
                </div>
              </div>
            </div>

          </div>
        </transition>

        <!-- Navigation Buttons -->
        <div class="nav-buttons" v-if="currentStep > 1">
          <button class="back-btn" @click="prevStep">
            <span class="material-icons-round">arrow_back</span>
          </button>
          
          <LiquidButton 
            :text="currentStep === totalSteps ? 'Submit Application' : 'Continue'" 
            type="primary" 
            size="lg" 
            class="next-btn"
            :loading="loading"
            @click="handleNext"
            :disabled="isNextDisabled"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import { useVendor } from '../composables/useVendor';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import vendorCats from '../../vendorcat.json';

const router = useRouter();
const route = useRoute();
const { createStore, updateStore, uploadKYC, submitForReview, loading } = useVendor();
const { user } = useAuth();
const { showToast } = useToast();

const currentStep = ref(1);
const totalSteps = 8;
const storeId = ref(route.params.id); // Get from route
const kycFile = ref(null);
const fileInput = ref(null);

const categories = vendorCats.categories;

const categoryOptions = computed(() => {
  const options = [];
  for (const group in categories) {
    categories[group].forEach(cat => {
      options.push({
        label: cat.name,
        value: cat.id,
        icon: 'category' // Optional: add icon if available or generic
      });
    });
  }
  return options;
});

const formData = reactive({
  name: '',
  phone: '',
  category: '',
  address: '',
  city: '',
  hours: '',
  bankName: '',
  accountNumber: '',
  ifsc: '',
  description: '',
  logoUrl: '',
  bannerUrl: ''
});

const isPhoneVerified = computed(() => !!user.value?.phoneNumber);

onMounted(() => {
  if (user.value?.phoneNumber) {
    formData.phone = user.value.phoneNumber;
  }
  // Ideally fetch existing store data if storeId exists to pre-fill
});

const isNextDisabled = computed(() => {
  if (currentStep.value === 3 && !kycFile.value) return true;
  if (currentStep.value === 4 && !formData.category) return true;
  return false;
});

const getStepTitle = (step) => {
  const titles = [
    "Welcome", "Store Basics", "Identity Verification", "Select Category", 
    "Store Details", "Bank Information", "Branding", "Review"
  ];
  return titles[step - 1];
};

const getStepDescription = (step) => {
  const descs = [
    "Get started with your store setup.",
    "Tell us the basics about your business.",
    "We need to verify your identity.",
    "What kind of products do you sell?",
    "Where is your store located?",
    "Where should we send your payouts?",
    "Make your store look professional.",
    "Double check everything looks good."
  ];
  return descs[step - 1];
};

const formatGroupName = (name) => {
  return name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

const nextStep = () => {
  if (currentStep.value < totalSteps) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

const handleNext = async () => {
  try {
    switch (currentStep.value) {
      case 2: // Basics
        if (!storeId.value) {
           // Should ideally be created in previous screen, but fallback
           storeId.value = await createStore({ name: formData.name, phone: formData.phone });
        } else {
           await updateStore(storeId.value, { name: formData.name, phone: formData.phone });
        }
        break;
      case 3: // KYC
        if (kycFile.value) {
          const url = await uploadKYC(kycFile.value);
          await updateStore(storeId.value, { kycUrl: url, kycStatus: 'uploaded' });
        }
        break;
      case 4: // Category
        await updateStore(storeId.value, { category: formData.category });
        break;
      case 5: // Details
        await updateStore(storeId.value, { address: formData.address, city: formData.city, hours: formData.hours });
        break;
      case 6: // Bank
        await updateStore(storeId.value, { bankDetails: { name: formData.bankName, account: formData.accountNumber, ifsc: formData.ifsc } });
        break;
      case 7: // Branding
        await updateStore(storeId.value, { description: formData.description, logoUrl: formData.logoUrl, bannerUrl: formData.bannerUrl });
        break;
      case 8: // Submit
        await submitForReview(storeId.value);
        showToast('Store submitted successfully! 🎉', 'success');
        router.push('/profile');
        return;
    }
    nextStep();
  } catch (e) {
    showToast('Error saving progress', 'error');
    console.error(e);
  }
};

const triggerFileUpload = () => fileInput.value.click();
const handleFileChange = (e) => {
  if (e.target.files[0]) kycFile.value = e.target.files[0];
};

const getCategoryName = (id) => {
  for (const group in categories) {
    const found = categories[group].find(c => c.id === id);
    if (found) return found.name;
  }
  return id;
};
</script>

<style scoped>
.onboarding-page {
  display: flex;
  height: 100vh;
  background: #fff;
  overflow: hidden;
}

/* Left Panel */
.info-panel {
  flex: 0 0 400px;
  background: #f8f9fa;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--primary-color);
  margin-bottom: 60px;
}

.step-indicator {
  margin-bottom: 40px;
  position: relative;
  z-index: 10;
}

.step-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-tertiary);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.step-heading {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
  color: var(--text-color);
}

.step-desc {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.progress-container {
  display: flex;
  gap: 6px;
  margin-top: auto;
}

.progress-segment {
  height: 4px;
  flex: 1;
  background: rgba(0,0,0,0.1);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.progress-segment.active {
  background: var(--primary-color);
}

.progress-segment.current {
  background: var(--primary-color);
  box-shadow: 0 0 10px rgba(var(--primary-rgb), 0.4);
}

.panel-decoration .circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.c1 { width: 300px; height: 300px; background: #e0c3fc; top: -100px; right: -100px; }
.c2 { width: 200px; height: 200px; background: #8ec5fc; bottom: -50px; left: -50px; }

/* Right Panel */
.form-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  position: relative;
}

.form-wrapper {
  width: 100%;
  max-width: 500px;
}

.step-content {
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.center-content {
  align-items: center;
  text-align: center;
  justify-content: center;
}

.illustration-icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.input-group {
  margin-bottom: 24px;
}

.input-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 8px;
  margin-left: 4px;
}

.row {
  display: flex;
  gap: 16px;
}

.row .input-group {
  flex: 1;
}

.verification-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 20px;
  background: #f0f2f5;
  color: var(--text-secondary);
  width: fit-content;
}

.verification-badge.verified {
  background: #e6fffa;
  color: #047857;
}

/* Upload Zone */
.upload-zone {
  border: 2px dashed #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-zone:hover {
  border-color: var(--primary-color);
  background: #f8fafc;
}

.upload-zone.has-file {
  border-style: solid;
  border-color: var(--primary-color);
  background: #f0f9ff;
}

.upload-content .icon {
  font-size: 48px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
}

/* Category Select */
.category-select-container {
  position: relative;
  margin-bottom: 24px;
}

.helper-text {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  margin-top: 8px;
}

/* Review Card */
.review-card {
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.review-card h3 {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.review-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-item .label {
  color: var(--text-secondary);
}

.review-item .value {
  font-weight: 600;
}

/* Nav Buttons */
.nav-buttons {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  width: 100%;
}

.back-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #f8fafc;
}

.next-btn {
  flex: 1;
}

.mt-8 { margin-top: 32px; }

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Responsive */
@media (max-width: 900px) {
  .onboarding-page {
    flex-direction: column;
    overflow-y: auto;
  }

  .info-panel {
    flex: 0 0 auto;
    padding: 30px 20px;
    min-height: 200px;
  }

  .brand-logo { margin-bottom: 20px; }
  .step-indicator { margin-bottom: 20px; }
  .step-heading { font-size: 1.8rem; }
  
  .form-panel {
    padding: 30px 20px;
    background: white;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    margin-top: -30px;
    z-index: 20;
    box-shadow: 0 -10px 30px rgba(0,0,0,0.05);
  }
}
</style>
