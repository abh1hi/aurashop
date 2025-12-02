<template>
  <div class="settings-container">
    <div class="settings-header">
      <h2 class="settings-title">{{ title }}</h2>
      <p class="settings-description">{{ description }}</p>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Store Name -->
      <div class="form-group">
        <label class="form-label">Store Name</label>
        <input 
          v-model="formData.name" 
          type="text" 
          class="form-input" 
          placeholder="Enter store name"
          required
        />
      </div>

      <!-- Description -->
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea 
          v-model="formData.description" 
          class="form-textarea" 
          placeholder="Tell customers about your store..."
        ></textarea>
      </div>

      <!-- Phone -->
      <div class="form-group">
        <label class="form-label">Contact Phone</label>
        <input 
          v-model="formData.phone" 
          type="tel" 
          class="form-input" 
          placeholder="+1 234 567 8900"
        />
      </div>

      <!-- Logo Upload -->
      <div class="form-group">
        <label class="form-label">Store Logo</label>
        <div class="logo-upload">
          <img 
            :src="previewLogo || formData.logoUrl || '/placeholder-store.png'" 
            alt="Store Logo" 
            class="current-logo"
          />
          <div class="upload-btn-wrapper">
            <button class="upload-btn" type="button">Change Logo</button>
            <input type="file" accept="image/*" @change="handleLogoChange" />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <LiquidButton 
          text="Cancel" 
          type="ghost" 
          @click.prevent="$emit('cancel')" 
        />
        <LiquidButton 
          text="Save Changes" 
          type="primary" 
          :loading="loading"
          @click="handleSubmit"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';

// created-by-llm-agent: reason = "no existing component found"; date = 2025-12-02

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Store Settings'
  },
  description: {
    type: String,
    default: 'Update your store information and branding.'
  }
});

const emit = defineEmits(['update', 'cancel']);

const formData = reactive({
  name: '',
  description: '',
  phone: '',
  logoUrl: ''
});

const logoFile = ref(null);
const previewLogo = ref(null);

// Initialize form data when store prop changes
watch(() => props.store, (newStore) => {
  if (newStore) {
    formData.name = newStore.name || '';
    formData.description = newStore.description || '';
    formData.phone = newStore.phone || '';
    formData.logoUrl = newStore.logoUrl || '';
  }
}, { immediate: true });

const handleLogoChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    logoFile.value = file;
    previewLogo.value = URL.createObjectURL(file);
  }
};

const handleSubmit = () => {
  emit('update', { ...formData, logoFile: logoFile.value });
};
</script>

<style scoped src="./StoreSettings.css"></style>
