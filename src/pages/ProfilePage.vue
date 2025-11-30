<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <!-- Desktop Layout -->
      <div class="desktop-layout">
        <div class="profile-grid">
          <!-- Left Column: Identity & Actions -->
          <LiquidCard variant="liquid" class="identity-card glass-panel">
            <div class="profile-cover"></div>
            <div class="profile-identity">
              <div class="avatar-wrapper">
                <img 
                  :src="userProfile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userProfile?.email || 'User')" 
                  alt="Avatar" 
                  class="avatar"
                />
                <div class="status-indicator online"></div>
              </div>
              <h1 class="username">{{ userProfile?.displayName || 'User' }}</h1>
              <p class="handle">@{{ userProfile?.username || 'username' }}</p>
              
              <div class="roles-pills">
                <span v-for="role in userProfile?.roles" :key="role" class="role-pill">
                  {{ formatRole(role) }}
                </span>
              </div>

              <div class="quick-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ userProfile?.addresses?.length || 0 }}</span>
                  <span class="stat-label">Addresses</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ userProfile?.roles?.includes('vendor') ? '1' : '0' }}</span>
                  <span class="stat-label">Stores</span>
                </div>
              </div>

              <div class="desktop-actions">
                <LiquidButton 
                  text="Edit Profile" 
                  type="secondary" 
                  icon="edit"
                  class="action-btn"
                  @click="router.push('/profile/edit')"
                />
                <LiquidButton 
                  v-if="!userProfile?.roles?.includes('vendor')"
                  text="Create Store" 
                  type="primary" 
                  icon="store"
                  class="action-btn"
                  @click="handleCreateStore"
                />
                <LiquidButton 
                  v-if="userProfile?.roles?.includes('vendor')"
                  text="My Stores" 
                  type="primary" 
                  icon="storefront"
                  class="action-btn"
                  @click="router.push('/vendor/my-stores')"
                />
                <LiquidButton 
                  text="Logout" 
                  type="danger" 
                  icon="logout"
                  class="action-btn"
                  @click="handleLogout"
                />
              </div>
            </div>
          </LiquidCard>

          <!-- Right Column: Details & Settings -->
          <div class="details-column">
            <LiquidCard variant="liquid" class="details-card glass-panel">
              <h2 class="section-header">Profile Details</h2>
              <LiquidAccordion>
                <LiquidAccordionItem title="Account Information" id="account">
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">User ID</span>
                      <span class="value mono">{{ userProfile?.uid }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Email</span>
                      <span class="value">{{ userProfile?.email }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Phone</span>
                      <span class="value">{{ userProfile?.phoneNumber || 'Not set' }}</span>
                    </div>
                  </div>
                </LiquidAccordionItem>

                <LiquidAccordionItem title="Address Book" id="addresses">
                  <div v-if="userProfile?.addresses && userProfile.addresses.length > 0" class="address-list">
                    <div v-for="addr in userProfile.addresses" :key="addr.id" class="address-card">
                      <div class="address-icon">
                        <span class="material-icons-round">place</span>
                      </div>
                      <div class="address-content">
                        <span class="address-label">{{ addr.label }}</span>
                        <p class="address-text">{{ addr.addressLine }}</p>
                        <p class="address-phone">{{ addr.phoneNumber }}</p>
                      </div>
                      <button class="icon-btn delete" @click="handleDeleteAddress(addr.id)">
                        <span class="material-icons-round">delete_outline</span>
                      </button>
                    </div>
                  </div>
                  <div v-else class="empty-state">
                    <span class="material-icons-round">location_off</span>
                    <p>No addresses saved</p>
                  </div>

                  <div class="add-address-section">
                    <div v-if="showAddAddress" class="add-address-form glass-inset">
                      <h4 class="form-title">New Address</h4>
                      <div class="form-grid">
                        <LiquidInput v-model="newAddress.label" placeholder="Label (e.g. Home)" />
                        <LiquidInput v-model="newAddress.phoneNumber" placeholder="Phone Number" />
                        <LiquidInput v-model="newAddress.addressLine" placeholder="Full Address" class="full-width" />
                      </div>
                      <div class="form-actions">
                        <button class="text-btn" @click="showAddAddress = false">Cancel</button>
                        <LiquidButton text="Save Address" size="sm" type="primary" @click="handleSaveAddress" />
                      </div>
                    </div>
                    <div v-else class="add-btn-wrapper">
                      <LiquidButton 
                        text="Add New Address" 
                        type="secondary" 
                        icon="add" 
                        size="sm" 
                        @click="showAddAddress = true" 
                      />
                    </div>
                  </div>
                </LiquidAccordionItem>

                <LiquidAccordionItem title="Vendor Profile" id="vendor" v-if="userProfile?.roles?.includes('vendor')">
                  <div class="info-grid">
                    <div class="info-item">
                      <span class="label">Store Name</span>
                      <span class="value">{{ userProfile?.vendorProfile?.storeName }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Status</span>
                      <span class="status-badge" :class="userProfile?.vendorProfile?.status">
                        {{ userProfile?.vendorProfile?.status }}
                      </span>
                    </div>
                  </div>
                </LiquidAccordionItem>

                <LiquidAccordionItem title="Theme & Appearance" id="theme">
                  <div class="theme-settings">
                    <div class="setting-row">
                      <span class="setting-label">Liquid Effects</span>
                      <LiquidToggle 
                        :modelValue="liquidAnimationsEnabled" 
                        @update:modelValue="toggleLiquidAnimations" 
                        label="Enable Liquid Animations"
                      />
                    </div>

                    <div class="setting-row column">
                      <span class="setting-label">Theme Category</span>
                      <LiquidSegmentedControl 
                        v-model="themeCategory" 
                        :options="[{label: 'Standard', value: 'standard'}, {label: 'Glass', value: 'glass'}]" 
                        full-width
                      />
                    </div>

                    <div class="setting-row column">
                      <span class="setting-label">Select Theme</span>
                      <LiquidDropdown 
                        :modelValue="currentTheme" 
                        :options="filteredThemeOptions" 
                        @update:modelValue="setTheme"
                        placeholder="Choose a theme"
                      />
                    </div>
                  </div>
                </LiquidAccordionItem>
              </LiquidAccordion>
            </LiquidCard>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="mobile-layout">
        <div class="mobile-header">
          <h1 class="page-title">Account</h1>
        </div>

        <div class="mobile-content-wrapper">
          <!-- Profile Card -->
          <LiquidCard variant="liquid" class="m-profile-card">
            <div class="m-profile-inner">
              <div class="m-avatar-container">
                <img 
                  :src="userProfile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userProfile?.email || 'User')" 
                  alt="Avatar" 
                  class="m-avatar"
                />
              </div>
              <div class="m-profile-info">
                <h2 class="m-username">{{ userProfile?.displayName || 'User' }}</h2>
                <p class="m-email">{{ userProfile?.email || 'No email set' }}</p>
              </div>
              <button class="m-edit-btn" @click="router.push('/profile/edit')">
                Edit profile
              </button>
            </div>
          </LiquidCard>

          <!-- Quick Actions (Pills) -->
          <div class="m-section-title">My Roles</div>
          <div class="m-pills-scroll">
            <div class="m-pill active">Buyer</div>
            <div class="m-pill" :class="{ active: userProfile?.roles?.includes('vendor') }">Vendor</div>
            <div class="m-pill" :class="{ active: userProfile?.roles?.includes('delivery') }">Delivery</div>
          </div>

          <!-- Promo/Status Card -->
          <div class="m-promo-card">
            <div class="m-promo-icon">
              <span class="material-icons-round">verified</span>
            </div>
            <div class="m-promo-content">
              <h3>AuraShop Member</h3>
              <p>You are enjoying full access to AuraShop</p>
            </div>
          </div>

          <!-- Create Store Action -->
          <LiquidButton 
            v-if="!userProfile?.roles?.includes('vendor')"
            text="Create Your Store" 
            type="primary" 
            icon="store"
            class="m-action-btn"
            @click="handleCreateStore"
          />

          <!-- Appearance Card -->
          <LiquidCard class="m-appearance-card glass-panel mb-md">
            <div class="m-section-title" style="margin-bottom: 16px;">Appearance</div>
            <div class="theme-settings mobile">
              <div class="setting-row">
                <span class="setting-label">Liquid Effects</span>
                <LiquidToggle 
                  :modelValue="liquidAnimationsEnabled" 
                  @update:modelValue="toggleLiquidAnimations" 
                />
              </div>

              <div class="setting-row column">
                <span class="setting-label">Theme Category</span>
                <LiquidSegmentedControl 
                  v-model="themeCategory" 
                  :options="[{label: 'Standard', value: 'standard'}, {label: 'Glass', value: 'glass'}]" 
                  full-width
                />
              </div>

              <div class="setting-row column">
                <span class="setting-label">Select Theme</span>
                <LiquidDropdown 
                  :modelValue="currentTheme" 
                  :options="filteredThemeOptions" 
                  @update:modelValue="setTheme"
                  placeholder="Choose a theme"
                />
              </div>
            </div>
          </LiquidCard>

          <!-- Settings List -->
          <div class="m-settings-list">
            <div class="m-list-item" @click="router.push('/orders')">
              <span class="material-icons-round m-list-icon">shopping_bag</span>
              <span class="m-list-label">My Orders</span>
              <span class="material-icons-round m-list-chevron">chevron_right</span>
            </div>
            <div class="m-list-item" v-if="userProfile?.roles?.includes('vendor')" @click="router.push('/vendor/my-stores')">
              <span class="material-icons-round m-list-icon">storefront</span>
              <span class="m-list-label">My Stores</span>
              <span class="material-icons-round m-list-chevron">chevron_right</span>
            </div>
            <div class="m-list-item" @click="router.push('/wishlist')">
              <span class="material-icons-round m-list-icon">favorite_border</span>
              <span class="m-list-label">Wishlist</span>
              <span class="material-icons-round m-list-chevron">chevron_right</span>
            </div>
            <div class="m-list-item" @click="router.push('/addresses')">
              <span class="material-icons-round m-list-icon">place</span>
              <span class="m-list-label">Address Book</span>
              <span class="material-icons-round m-list-chevron">chevron_right</span>
            </div>
            <div class="m-list-item" @click="handleLogout">
              <span class="material-icons-round m-list-icon">logout</span>
              <span class="m-list-label">Log Out</span>
              <span class="material-icons-round m-list-chevron">chevron_right</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
// created-by-llm-agent: reason = "implementing UI rules"; date = 2025-11-30
import { ref, computed } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidAccordion from '../components/liquid-ui-kit/LiquidAccordion/LiquidAccordion.vue';
import LiquidAccordionItem from '../components/liquid-ui-kit/LiquidAccordion/LiquidAccordionItem.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidToggle from '../components/liquid-ui-kit/LiquidToggle/LiquidToggle.vue';
import LiquidSegmentedControl from '../components/liquid-ui-kit/LiquidSegmentedControl/LiquidSegmentedControl.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import { useProfilePage } from './ProfilePage.js';
import { useTheme } from '../composables/useTheme';

const {
    router,
    userProfile,
    user,
    showAddAddress,
    newAddress,
    handleSaveAddress,
    handleDeleteAddress,
    formatRole,
    handleCreateStore,
    handleLogout
} = useProfilePage();

const { liquidAnimationsEnabled, currentTheme, toggleLiquidAnimations, setTheme } = useTheme();

const themeCategory = ref('standard');

const standardThemes = [
    { label: 'Chic (Default)', value: 'chic', icon: 'palette' },
    { label: 'Oceanic', value: 'oceanic', icon: 'water_drop' },
    { label: 'Sunset', value: 'sunset', icon: 'wb_sunny' },
    { label: 'Forest', value: 'forest', icon: 'forest' },
    { label: 'Lavender', value: 'lavender', icon: 'local_florist' },
    { label: 'Mint', value: 'mint', icon: 'eco' },
    { label: 'Peach', value: 'peach', icon: 'emoji_food_beverage' },
    { label: 'Slate', value: 'slate', icon: 'dark_mode' },
];

const glassThemes = [
    { label: 'Crystal', value: 'crystal', icon: 'diamond' },
    { label: 'Frost', value: 'frost', icon: 'ac_unit' },
    { label: 'Aurora', value: 'aurora', icon: 'auto_awesome' },
    { label: 'Obsidian', value: 'obsidian', icon: 'volcano' },
    { label: 'Prism', value: 'prism', icon: 'looks' },
];

const filteredThemeOptions = computed(() => {
    return themeCategory.value === 'standard' ? standardThemes : glassThemes;
});
</script>

<style scoped>
@import './ProfilePage.css';
</style>
