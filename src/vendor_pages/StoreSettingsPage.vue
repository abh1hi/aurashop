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
        Back to Dashboard
      </div>

      <header class="page-header">
        <h1 class="page-title">Entity Configuration</h1>
      </header>

      <LiquidSettingsLayout v-model="activeTab" :menuItems="menuItems">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'">
          <StoreSettings 
            v-if="store" 
            :store="store" 
            title="Core Identity"
            description="Fine-tune your entity's public presence and identifiers."
            @update="handleUpdate" 
            @cancel="router.back()" 
          />
          <div v-else class="loading-state">
            <LiquidSpinner />
          </div>
        </div>

        <!-- Appearance -->
        <div v-if="activeTab === 'appearance'">
          <div class="settings-section">
            <h3 class="settings-section-title">Visual Signature</h3>
            <p class="text-secondary">Tailor the aesthetic elements of your digital domain.</p>
            <!-- Add appearance settings here -->
          </div>
        </div>

        <!-- Notifications -->
        <div v-if="activeTab === 'notifications'">
          <div class="settings-section">
            <h3 class="settings-section-title">Signal Center</h3>
            <p class="text-secondary">Configure broadcast and reporting protocols.</p>
          </div>
        </div>
        
        <!-- Security -->
        <div v-if="activeTab === 'security'">
          <div class="settings-section">
            <h3 class="settings-section-title">Shield Protocol</h3>
            <p class="text-secondary">Manage access credentials and protection layers.</p>
          </div>
        </div>
      </LiquidSettingsLayout>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import StoreSettings from '../components/StoreSettings.vue';
import LiquidSettingsLayout from '../components/liquid-ui-kit/LiquidSettingsLayout/LiquidSettingsLayout.vue';
import LiquidSpinner from '../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const route = useRoute();
const router = useRouter();
const { getStore, updateStore, uploadFile } = useVendor();
const { showToast } = useToast();

const store = ref(null);
const activeTab = ref('general');

const menuItems = [
  { label: 'Identity', value: 'general', icon: 'fingerprint' },
  { label: 'Signature', value: 'appearance', icon: 'auto_awesome' },
  { label: 'Signals', value: 'notifications', icon: 'sensors' },
  { label: 'Shield', value: 'security', icon: 'verified_user' }
];

const handleUpdate = async (updatedData) => {
  try {
    let logoUrl = updatedData.logoUrl;

    if (updatedData.logoFile) {
      logoUrl = await uploadFile(updatedData.logoFile, `stores/${store.value.id}/logo`);
    }

    await updateStore(store.value.id, {
      name: updatedData.name,
      description: updatedData.description,
      phone: updatedData.phone,
      logoUrl: logoUrl
    });

    store.value = { ...store.value, ...updatedData, logoUrl };
    showToast('Entity configuration synchronized.', 'success');
  } catch (error) {
    console.error('Error updating store:', error);
    showToast('Failed to synchronize parameters.', 'error');
  }
};

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
    store.value = await getStore(storeId);
  }
});
</script>

<style scoped src="./StoreSettingsPage.css"></style>
