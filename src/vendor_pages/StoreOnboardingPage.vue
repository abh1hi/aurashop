<template>
  <div class="onboarding-page">
    <!-- Background Elements -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="onboarding-container">
      <!-- Left Panel: Stepper & Info -->
      <div class="info-panel glass-panel">
        <div class="brand-logo">
          <span class="material-icons-round">storefront</span>
          <span>AuraShop</span>
        </div>

        <!-- Mobile Step Indicator -->
        <div class="mobile-step-indicator">
          <span class="step-text">Step {{ currentStep }} of {{ totalSteps }}</span>
          <div class="step-progress-bar">
            <div class="progress-fill" :style="{ width: (currentStep / totalSteps) * 100 + '%' }"></div>
          </div>
        </div>
        
        <div class="stepper-container">
          <LiquidStepper 
            :modelValue="currentStep - 1" 
            :steps="steps" 
            vertical 
            :clickable="false"
          />
        </div>
      </div>

      <!-- Right Panel: Form -->
      <div class="form-panel glass-panel">
        <div class="form-wrapper">
          <transition name="fade-slide" mode="out-in">
            <div :key="currentStep" class="step-container">
              
              <!-- Step 1: Welcome -->
              <div v-if="currentStep === 1" class="step-content center-content">
                <div class="illustration-icon floating">🚀</div>
                <h1 class="step-title">Let's build your store</h1>
                <p class="step-subtitle">You're just a few steps away from reaching millions of customers.</p>
                <LiquidButton text="Start Setup" type="primary" size="lg" @click="nextStep" class="mt-xl" />
              </div>

              <!-- Step 2: Basics -->
              <div v-if="currentStep === 2" class="step-content">
                <h2 class="form-title">Store Basics</h2>
                <div class="input-group">
                  <label>Store Name</label>
                  <LiquidInput v-model="formData.name" placeholder="e.g. Urban Threads" icon="store" />
                </div>
                <div class="input-group">
                  <label>Phone Number</label>
                  <div class="phone-input-wrapper">
                    <vue-tel-input 
                      v-model="rawPhone" 
                      mode="international"
                      :autoDefaultCountry="false"
                      :disabled="isPhoneVerified || verificationSent"
                      :inputOptions="{ placeholder: 'Phone Number' }"
                      @validate="onPhoneValidate"
                      class="liquid-phone-input"
                    ></vue-tel-input>
                    <LiquidButton 
                      v-if="!isPhoneVerified && !verificationSent && isValidPhone"
                      text="Verify"
                      size="sm"
                      type="secondary"
                      class="verify-btn"
                      @click="sendVerificationCode"
                      :loading="verifying"
                    />
                  </div>
                  
                  <div v-if="verificationSent && !isPhoneVerified" class="otp-section">
                    <p class="otp-hint">Enter the 6-digit code sent to {{ formData.phone }}</p>
                    <LiquidOTPInput 
                      v-model="otpCode" 
                      :length="6" 
                      @complete="verifyOTP"
                    />
                    <div class="otp-actions">
                      <button class="text-btn" @click="verificationSent = false">Change Number</button>
                      <button class="text-btn" @click="sendVerificationCode">Resend Code</button>
                    </div>
                  </div>

                  <div class="verification-badge" :class="{ verified: isPhoneVerified }">
                    <span class="material-icons-round">{{ isPhoneVerified ? 'check_circle' : 'info' }}</span>
                    {{ isPhoneVerified ? 'Verified' : 'Verification required' }}
                  </div>
                  <div id="recaptcha-container"></div>
                </div>
              </div>

              <!-- Step 3: Identity Verification -->
              <div v-if="currentStep === 3" class="step-content">
                <h2 class="form-title">Identity Verification</h2>
                <div class="info-card">
                  <span class="material-icons-round icon">security</span>
                  <p>We need to verify your identity to ensure a safe marketplace.</p>
                </div>

                <div v-if="existingKYC" class="existing-kyc-card">
                    <div class="kyc-header">
                        <h4>Previously Uploaded Documents</h4>
                        <LiquidButton 
                          :text="useExistingKYC ? 'Using Existing' : 'Use Existing'" 
                          :type="useExistingKYC ? 'success' : 'secondary'" 
                          size="sm" 
                          @click="toggleExistingKYC"
                        />
                    </div>
                    <div class="kyc-files" v-if="useExistingKYC">
                        <div class="file-item">
                            <span class="material-icons-round">videocam</span>
                            <span>{{ existingKYC.videoName || 'Video' }}</span>
                        </div>
                        <div class="file-item">
                            <span class="material-icons-round">description</span>
                            <span>{{ existingKYC.docName || 'Document' }}</span>
                        </div>
                    </div>
                </div>
                
                <div v-if="!useExistingKYC">
                  <div class="input-group">
                      <label>Verification Video (Max 10s)</label>
                      <div class="file-upload-box" @click="triggerVideoUpload" :class="{ 'has-file': videoFile }">
                      <span class="material-icons-round">videocam</span>
                      <p>{{ videoFile ? videoFile.name : 'Record or Upload Video' }}</p>
                      <input 
                          type="file" 
                          ref="videoInput" 
                          accept="video/*" 
                          @change="handleVideoChange" 
                          hidden
                      >
                      </div>
                      <p v-if="videoError" class="error-text">{{ videoError }}</p>
                  </div>

                  <div class="input-group">
                      <label>Government ID (PDF, Max 500kb)</label>
                      <div class="file-upload-box" @click="triggerDocUpload" :class="{ 'has-file': docFile }">
                      <span class="material-icons-round">description</span>
                      <p>{{ docFile ? docFile.name : 'Upload PDF Document' }}</p>
                      <input 
                          type="file" 
                          ref="docInput" 
                          accept="application/pdf" 
                          @change="handleDocChange" 
                          hidden
                      >
                      </div>
                      <p v-if="docError" class="error-text">{{ docError }}</p>
                  </div>
                </div>
              </div>

              <!-- Step 4: Category -->
              <div v-if="currentStep === 4" class="step-content">
                <h2 class="form-title">Select Category</h2>
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
                <h2 class="form-title">Store Details</h2>
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
                <h2 class="form-title">Bank Information</h2>
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
                <h2 class="form-title">Store Branding</h2>
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
                <h2 class="form-title">Review & Submit</h2>
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
  </div>
</template>

<script setup>
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidOTPInput from '../components/liquid-ui-kit/LiquidOTPInput/LiquidOTPInput.vue';
import LiquidStepper from '../components/liquid-ui-kit/LiquidStepper/LiquidStepper.vue';
import { useStoreOnboardingLogic } from './StoreOnboardingPage';

const {
  currentStep,
  totalSteps,
  storeId,
  videoFile,
  docFile,
  videoInput,
  docInput,
  videoError,
  docError,
  verificationSent,
  otpCode,
  verifying,
  confirmationResult,
  rawPhone,
  isValidPhone,
  formData,
  isPhoneVerified,
  isNextDisabled,
  loading,
  categoryOptions,
  onPhoneValidate,
  triggerVideoUpload,
  triggerDocUpload,
  handleVideoChange,
  handleDocChange,
  sendVerificationCode,
  verifyOTP,
  getStepTitle,
  getStepDescription,
  nextStep,
  prevStep,
  handleNext,
  getCategoryName,
  existingKYC,
  useExistingKYC,
  toggleExistingKYC,
  steps
} = useStoreOnboardingLogic();
</script>

<style scoped src="./StoreOnboardingPage.css"></style>
