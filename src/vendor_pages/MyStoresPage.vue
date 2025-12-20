<template>
  <div class="page-container">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      <header class="dashboard-header">
        <div>
          <h1 class="page-title">My Entities</h1>
          <p class="page-subtitle">Oversee and refine your digital presence</p>
        </div>
        <LiquidButton 
          text="Launch New Store" 
          icon="add" 
          type="primary" 
          size="lg"
          @click="createNewStore"
        />
      </header>

      <!-- Tabs -->
      <nav class="tabs-container">
        <LiquidSegmentedControl 
          v-model="activeTab" 
          :options="[
            { label: 'All', value: 'all' },
            { label: 'Approved', value: 'active' },
            { label: 'In Review', value: 'pending_review' },
            { label: 'Drafts', value: 'draft' }
          ]" 
        />
      </nav>

      <!-- Store List -->
      <section class="store-list" v-if="!loading">
        <div v-if="filteredStores.length === 0" class="empty-state-luxury fade-in">
          <div class="luxury-icon-wrap">
            <span class="material-icons-round">temple_hindu</span>
          </div>
          <h3 class="empty-title">Establish Your First Domain</h3>
          <p class="empty-desc">Your journey to global commerce begins here. Create a store to start showcasing your collection.</p>
          <LiquidButton 
            text="Get Started" 
            type="primary" 
            @click="createNewStore"
          />
        </div>

        <LiquidCard 
          v-for="store in filteredStores" 
          :key="store.id" 
          class="store-card"
          variant="liquid"
        >
          <div class="card-inner">
            <div class="card-top">
              <div class="store-info-box">
                <div class="store-visual">
                  <img v-if="store.logoUrl" :src="store.logoUrl" alt="Store Logo" />
                  <span v-else class="material-icons-round placeholder-icon">storefront</span>
                </div>
                <div class="name-box">
                  <h3>{{ store.name || 'Bespoke Concept' }}</h3>
                  <div class="meta-row">
                    <span class="status-capsule" :class="store.status">{{ formatStatus(store.status) }}</span>
                    <div class="rating-pill" v-if="store.rating">
                      <span class="material-icons-round star-icon">star</span>
                      {{ store.rating }}
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="quick-actions">
                <button class="mini-action-btn" title="Dashboard" @click="handleEdit(store)">
                  <span class="material-icons-round">analytics</span>
                </button>
                <button class="mini-action-btn" title="Settings" @click="handleSettings(store)">
                  <span class="material-icons-round">settings_suggest</span>
                </button>
                <button class="mini-action-btn delete-btn" title="Remove" @click="handleDelete(store)">
                  <span class="material-icons-round">delete_outline</span>
                </button>
              </div>
            </div>

            <div class="card-bottom">
              <div class="online-toggle" v-if="store.status === 'active'">
                <label class="liquid-switch">
                  <input type="checkbox" :checked="store.isActive" @change="toggleStatus(store)">
                  <span class="switch-slider"></span>
                </label>
                <span class="toggle-text" :class="{ 'is-online': store.isActive }">
                  {{ store.isActive ? 'System Live' : 'Maintenance' }}
                </span>
              </div>
              <div v-else></div> <!-- Spacer -->

              <LiquidButton 
                v-if="store.status === 'draft'"
                text="Resume Setup" 
                type="ghost" 
                size="sm"
                icon="play_arrow"
                @click="handleEdit(store)"
              />
              <LiquidButton 
                v-else
                text="Enter Dashboard" 
                type="glass" 
                size="sm"
                icon="north_east"
                @click="handleEdit(store)"
              />
            </div>
          </div>
        </LiquidCard>
      </section>

      <div v-else class="loading-state-premium">
        <div class="liquid-spinner"></div>
      </div>
    </main>
    
    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidSegmentedControl from '../components/liquid-ui-kit/LiquidSegmentedControl/LiquidSegmentedControl.vue';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const router = useRouter();
const { fetchMyStores, deleteStore, toggleStoreStatus, createStore, subscribeToMyStores } = useVendor();
const { showToast } = useToast();

const stores = ref([]);
const loading = ref(true);
const activeTab = ref('all');
let unsubscribe = null;

onMounted(async () => {
  loading.value = true;
  unsubscribe = subscribeToMyStores((updatedStores) => {
    stores.value = updatedStores;
    loading.value = false;
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

const filteredStores = computed(() => {
  if (!activeTab.value || activeTab.value === 'all') return stores.value;
  return stores.value.filter(s => s && s.status === activeTab.value);
});

const formatStatus = (status) => {
  return status.replace('_', ' ').toUpperCase();
};

const createNewStore = async () => {
  try {
    const storeId = await createStore({ name: 'Bespoke Concept' });
    router.push(`/vendor/store/${storeId}/onboarding`);
  } catch (e) {
    showToast('Error creating entity', 'error');
  }
};

const handleEdit = (store) => {
  if (store.status === 'draft') {
    router.push(`/vendor/store/${store.id}/onboarding`);
  } else {
    router.push(`/vendor/store/${store.id}/dashboard`);
  }
};

const handleSettings = (store) => {
  router.push(`/vendor/store/${store.id}/settings`);
};

const handleDelete = async (store) => {
  if (!confirm('Are you sure you want to remove this entity? This action is irreversible.')) return;
  try {
    await deleteStore(store.id);
    showToast('Entity removed', 'success');
  } catch (e) {
    showToast('Error removing entity', 'error');
  }
};

const toggleStatus = async (store) => {
  try {
    const newStatus = !store.isActive;
    await toggleStoreStatus(store.id, newStatus);
    store.isActive = newStatus; // Optimistic update
    showToast(`System is now ${newStatus ? 'Live' : 'Offline'}`, 'success');
  } catch (e) {
    showToast('Error updating status', 'error');
  }
};
</script>

<style scoped src="./MyStoresPage.css"></style>
