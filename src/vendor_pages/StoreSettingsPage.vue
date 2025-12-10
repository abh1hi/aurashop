<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">arrow_back</span>
        Back to Dashboard
      </div>

      <div class="page-header">
        <h1 class="page-title">Store Settings</h1>
      </div>

      <LiquidSettingsLayout v-model="activeTab" :menuItems="menuItems">
        <!-- General Settings -->
        <div v-if="activeTab === 'general'">
          <StoreSettings 
            v-if="store" 
            :store="store" 
            @update="handleUpdate" 
            @cancel="router.back()" 
          />
          <div v-else class="loading-state">
            <LiquidSpinner />
          </div>
        </div>

        <!-- Appearance (Placeholder) -->
        <div v-if="activeTab === 'appearance'">
          <div class="settings-section">
            <h3 class="settings-section-title">Appearance</h3>
            <p class="text-secondary">Customize your store's look and feel.</p>
            <!-- Add appearance settings here -->
          </div>
        </div>

        <!-- Notifications (Placeholder) -->
        <div v-if="activeTab === 'notifications'">
          <div class="settings-section">
            <h3 class="settings-section-title">Notifications</h3>
            <p class="text-secondary">Manage your email and push notifications.</p>
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
  { label: 'General', value: 'general', icon: 'settings' },
  { label: 'Appearance', value: 'appearance', icon: 'palette' },
  { label: 'Notifications', value: 'notifications', icon: 'notifications' },
  { label: 'Security', value: 'security', icon: 'lock' }
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
    showToast('Store updated successfully!', 'success');
  } catch (error) {
    console.error('Error updating store:', error);
    showToast('Failed to update store.', 'error');
  }
};

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
    store.value = await getStore(storeId);
  }
});
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  background-image: var(--gradient-mesh);
  background-attachment: fixed;
  background-size: cover;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 24px;
  font-weight: 600;
  width: fit-content;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-color);
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px;
}
</style>
