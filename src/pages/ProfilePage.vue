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
              <h1 class="username">{{ userProfile?.displayName || (isAnonymous ? 'Guest User' : 'User') }}</h1>
              <p class="handle">@{{ userProfile?.username || (isAnonymous ? 'guest' : 'username') }}</p>
              
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
                  v-if="isAnonymous"
                  text="Log In / Sign Up" 
                  type="primary" 
                  icon="login"
                  class="action-btn"
                  @click="router.push('/login')"
                />
                <LiquidButton 
                  v-if="!isAnonymous && !userProfile?.roles?.includes('vendor')"
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
                  <div class="address-book-preview">
                    <div v-if="userProfile?.addresses && userProfile.addresses.length > 0" class="address-list-preview">
                        <div v-for="addr in userProfile.addresses.slice(0, 2)" :key="addr.id" class="address-preview-item">
                            <span class="material-icons-round">place</span>
                            <span>{{ addr.label }}: {{ addr.addressLine }}</span>
                        </div>
                        <p v-if="userProfile.addresses.length > 2" class="more-addresses">
                            +{{ userProfile.addresses.length - 2 }} more
                        </p>
                    </div>
                    <div v-else class="empty-state-preview">
                        <p>No addresses saved.</p>
                    </div>
                    <LiquidButton 
                        text="Manage Addresses" 
                        icon="map" 
                        type="secondary" 
                        size="sm" 
                        class="mt-2"
                        @click="openAddressBook" 
                    />
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
                <h2 class="m-username">{{ userProfile?.displayName || (isAnonymous ? 'Guest User' : 'User') }}</h2>
                <p class="m-email">{{ userProfile?.email || (isAnonymous ? 'Anonymous' : 'No email set') }}</p>
              </div>
              <button v-if="!isAnonymous" class="m-edit-btn" @click="router.push('/profile/edit')">
                Edit profile
              </button>
              <button v-else class="m-edit-btn primary" @click="router.push('/login')">
                Log In / Sign Up
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
            <div class="m-list-item" @click="openAddressBook">
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

    <!-- Address Book Action Sheet -->
    <LiquidActionSheet
        v-model="showAddressBookSheet"
        title="Address Book"
        subtitle="Manage your saved addresses"
    >
        <div class="address-book-content">
            <div v-if="!userProfile?.addresses || userProfile.addresses.length === 0" class="empty-state">
                <span class="material-icons-round empty-icon">location_off</span>
                <p>No addresses saved yet.</p>
            </div>
            
            <div class="address-list">
                <div v-for="addr in userProfile?.addresses" :key="addr.id" class="address-card">
                    <div class="address-icon">
                        <span class="material-icons-round">place</span>
                    </div>
                    <div class="address-details">
                        <span class="address-label">{{ addr.label }}</span>
                        <p class="address-text">{{ addr.addressLine }}</p>
                        <span class="address-phone">{{ addr.phoneNumber }}</span>
                    </div>
                    <div class="address-actions">
                        <LiquidButton icon="edit" type="ghost" size="sm" @click="editAddress(addr.id)" />
                        <LiquidButton icon="delete" type="ghost" size="sm" class="delete-btn" @click="confirmDeleteAddress(addr.id)" />
                    </div>
                </div>
            </div>

            <LiquidButton 
                text="Add New Address" 
                icon="add_location" 
                type="primary" 
                class="w-100 mt-4" 
                @click="addNewAddress" 
            />
        </div>
    </LiquidActionSheet>

    <BottomNavBar />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidAccordion from '../components/liquid-ui-kit/LiquidAccordion/LiquidAccordion.vue';
import LiquidAccordionItem from '../components/liquid-ui-kit/LiquidAccordion/LiquidAccordionItem.vue';
import LiquidToggle from '../components/liquid-ui-kit/LiquidToggle/LiquidToggle.vue';
import LiquidSegmentedControl from '../components/liquid-ui-kit/LiquidSegmentedControl/LiquidSegmentedControl.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidActionSheet from '../components/liquid-ui-kit/LiquidActionSheet/LiquidActionSheet.vue';
import { useProfilePage } from './ProfilePage.js';

const {
    router,
    userProfile,
    user,
    isAnonymous,
    handleDeleteAddress,
    formatRole,
    handleCreateStore,
    handleLogout,
    showAddressBookSheet,
    openAddressBook,
    addNewAddress,
    editAddress,
    confirmDeleteAddress,
    liquidAnimationsEnabled,
    currentTheme,
    toggleLiquidAnimations,
    setTheme,
    themeCategory,
    filteredThemeOptions
} = useProfilePage();
</script>

<style scoped>
@import './ProfilePage.css';
</style>
