<template>
  <div class="page-container">
    <!-- Background Elements -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      
      <!-- DESKTOP VIEW -->
      <div class="desktop-view">
        
        <!-- Hero Section -->
        <div class="profile-hero">
          <div class="hero-banner"></div>
          <div class="hero-content">
            <div class="profile-identity-card glass-panel">
              <div class="identity-main">
                <div class="avatar-wrapper-hero">
                  <img 
                    :src="userProfile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userProfile?.email || 'User')" 
                    alt="Avatar" 
                    class="avatar-hero"
                  />
                  <div class="status-dot"></div>
                </div>
                <div class="identity-text">
                  <h1 class="hero-name">{{ userProfile?.displayName || (isAnonymous ? 'Guest User' : 'User') }}</h1>
                  <p class="hero-handle">@{{ userProfile?.username || (isAnonymous ? 'guest' : 'username') }}</p>
                  <div class="hero-roles">
                    <span v-for="role in userProfile?.roles" :key="role" class="hero-role-pill">
                      {{ formatRole(role) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="hero-stats">
                <div class="hero-stat-item">
                  <span class="h-stat-val">{{ userProfile?.addresses?.length || 0 }}</span>
                  <span class="h-stat-lbl">Addresses</span>
                </div>
                <div class="hero-stat-divider"></div>
                <div class="hero-stat-item">
                  <span class="h-stat-val">{{ userProfile?.roles?.includes('vendor') ? '1' : '0' }}</span>
                  <span class="h-stat-lbl">Stores</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Bar -->
        <div class="desktop-nav-bar glass-panel">
          <div class="nav-tabs">
            <button 
              v-for="tab in tabs" 
              :key="tab.value"
              class="desktop-tab-btn"
              :class="{ active: activeTab === tab.value }"
              @click="activeTab = tab.value"
            >
              <span class="material-icons-round">{{ getTabIcon(tab.value) }}</span>
              <span>{{ tab.label }}</span>
            </button>
          </div>
          <div class="nav-actions">
            <LiquidButton 
              text="Edit Profile" 
              size="sm" 
              icon="edit" 
              type="secondary"
              @click="router.push('/profile/edit')"
            />
          </div>
        </div>

        <!-- Content Area -->
        <div class="desktop-content-area">
          <!-- OVERVIEW CONTENT -->
          <div v-if="activeTab === 'overview'" class="content-grid fade-in">
            <div class="grid-col-main">
              <LiquidCard class="detail-card">
                <h3>Account Information</h3>
                <div class="detail-row">
                  <span class="d-label">Email Address</span>
                  <span class="d-value">{{ userProfile?.email }}</span>
                </div>
                <div class="detail-row">
                  <span class="d-label">Phone Number</span>
                  <span class="d-value">{{ userProfile?.phoneNumber || 'Not set' }}</span>
                </div>
                <div class="detail-row">
                  <span class="d-label">User ID</span>
                  <span class="d-value mono">{{ userProfile?.uid }}</span>
                </div>
              </LiquidCard>

              <LiquidCard class="detail-card">
                <h3>Default Address</h3>
                <div v-if="userProfile?.addresses && userProfile.addresses.length > 0" class="address-preview-hero">
                  <div class="addr-icon-box">
                    <span class="material-icons-round">home</span>
                  </div>
                  <div class="addr-info">
                    <span class="addr-name">{{ userProfile.addresses[0].label }}</span>
                    <p class="addr-line">{{ userProfile.addresses[0].addressLine }}</p>
                  </div>
                  <LiquidButton text="Manage" size="sm" type="ghost" @click="openAddressBook" />
                </div>
                <div v-else class="empty-state-card">
                  <p>No addresses saved yet.</p>
                  <LiquidButton text="Add Address" size="sm" @click="openAddressBook" />
                </div>
              </LiquidCard>
            </div>

            <div class="grid-col-side">
              <LiquidCard class="quick-actions-card">
                <h3>Quick Actions</h3>
                <div class="qa-grid">
                  <button class="qa-btn" @click="router.push('/wishlist')">
                    <span class="material-icons-round">favorite</span>
                    <span>Wishlist</span>
                  </button>
                  <button class="qa-btn" @click="router.push('/orders')">
                    <span class="material-icons-round">shopping_bag</span>
                    <span>Orders</span>
                  </button>
                  <button 
                    v-if="!userProfile?.roles?.includes('vendor')" 
                    class="qa-btn primary" 
                    @click="handleCreateStore"
                  >
                    <span class="material-icons-round">store</span>
                    <span>Create Store</span>
                  </button>
                  <button 
                    v-else 
                    class="qa-btn primary" 
                    @click="router.push('/vendor/my-stores')"
                  >
                    <span class="material-icons-round">storefront</span>
                    <span>My Stores</span>
                  </button>
                </div>
              </LiquidCard>
            </div>
          </div>

          <!-- ORDERS CONTENT -->
          <div v-if="activeTab === 'orders'" class="content-full fade-in">
            <div class="empty-hero">
              <span class="material-icons-round">shopping_cart</span>
              <h3>No Recent Orders</h3>
              <p>Your order history will appear here once you start shopping.</p>
              <LiquidButton text="Browse Products" type="primary" @click="router.push('/')" />
            </div>
          </div>

          <!-- SETTINGS CONTENT -->
          <div v-if="activeTab === 'settings'" class="content-grid fade-in">
            <div class="grid-col-main">
              <LiquidCard class="detail-card">
                <h3>Appearance Settings</h3>
                <div class="setting-hero-row">
                  <div class="setting-meta">
                    <span class="s-name">Liquid Animations</span>
                    <span class="s-desc">Enable fluid glass effects and animations</span>
                  </div>
                  <LiquidToggle 
                    :modelValue="liquidAnimationsEnabled" 
                    @update:modelValue="toggleLiquidAnimations" 
                  />
                </div>
                <div class="setting-hero-row">
                  <div class="setting-meta">
                    <span class="s-name">Theme Preference</span>
                    <span class="s-desc">Choose your preferred visual theme</span>
                  </div>
                  <div class="theme-controls">
                    <LiquidDropdown 
                      :modelValue="currentTheme" 
                      :options="filteredThemeOptions" 
                      @update:modelValue="setTheme"
                      placeholder="Select Theme"
                    />
                  </div>
                </div>
              </LiquidCard>
            </div>
            
            <div class="grid-col-side">
              <LiquidCard class="danger-zone-card">
                <h3>Account Actions</h3>
                <button class="danger-btn" @click="handleLogout">
                  <span class="material-icons-round">logout</span>
                  <span>Log Out</span>
                </button>
              </LiquidCard>
            </div>
          </div>
        </div>

      </div>

      <!-- MOBILE VIEW -->
      <div class="mobile-view">
        <div class="mobile-header-card glass-panel">
          <div class="m-avatar-row">
            <img 
              :src="userProfile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userProfile?.email || 'User')" 
              alt="Avatar" 
              class="avatar-md"
            />
            <div class="m-user-details">
              <h2>{{ userProfile?.displayName || 'Guest' }}</h2>
              <p>@{{ userProfile?.username || 'guest' }}</p>
            </div>
            <button class="icon-btn-glass" @click="router.push('/profile/edit')">
              <span class="material-icons-round">edit</span>
            </button>
          </div>
          
          <div class="m-stats-row">
            <div class="m-stat">
              <b>{{ userProfile?.addresses?.length || 0 }}</b>
              <span>Addresses</span>
            </div>
            <div class="m-stat">
              <b>{{ userProfile?.roles?.includes('vendor') ? '1' : '0' }}</b>
              <span>Stores</span>
            </div>
            <div class="m-stat">
              <b>{{ userProfile?.roles?.length || 1 }}</b>
              <span>Roles</span>
            </div>
          </div>
        </div>

        <div class="mobile-menu glass-panel">
          <div class="menu-item" @click="activeTab = 'overview'; showAddressBookSheet = true">
             <span class="material-icons-round icon-box">place</span>
             <span>Address Book</span>
             <span class="material-icons-round chevron">chevron_right</span>
          </div>
          <div class="menu-item" @click="router.push('/orders')">
             <span class="material-icons-round icon-box">shopping_bag</span>
             <span>My Orders</span>
             <span class="material-icons-round chevron">chevron_right</span>
          </div>
          <div class="menu-item" @click="router.push('/wishlist')">
             <span class="material-icons-round icon-box">favorite</span>
             <span>Wishlist</span>
             <span class="material-icons-round chevron">chevron_right</span>
          </div>
          <div class="menu-item" v-if="userProfile?.roles?.includes('vendor')" @click="router.push('/vendor/my-stores')">
             <span class="material-icons-round icon-box">storefront</span>
             <span>My Stores</span>
             <span class="material-icons-round chevron">chevron_right</span>
          </div>
          <div class="menu-item" v-else @click="handleCreateStore">
             <span class="material-icons-round icon-box">add_business</span>
             <span>Create Store</span>
             <span class="material-icons-round chevron">chevron_right</span>
          </div>
        </div>

        <div class="mobile-settings glass-panel">
          <h3>Settings</h3>
          <div class="menu-item">
             <span class="material-icons-round icon-box">palette</span>
             <span>Theme</span>
             <LiquidDropdown 
                class="mini-dropdown"
                :modelValue="currentTheme" 
                :options="filteredThemeOptions" 
                @update:modelValue="setTheme"
             />
          </div>
           <div class="menu-item" @click="handleLogout">
             <span class="material-icons-round icon-box text-danger">logout</span>
             <span class="text-danger">Log Out</span>
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
import LiquidTabs from '../components/liquid-ui-kit/LiquidTabs/LiquidTabs.vue';
import LiquidToggle from '../components/liquid-ui-kit/LiquidToggle/LiquidToggle.vue';
import LiquidSegmentedControl from '../components/liquid-ui-kit/LiquidSegmentedControl/LiquidSegmentedControl.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidActionSheet from '../components/liquid-ui-kit/LiquidActionSheet/LiquidActionSheet.vue';
import { useProfilePage } from './ProfilePage';

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
    filteredThemeOptions,
    activeTab,
    getTabIcon,
    getTabLabel
} = useProfilePage();

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'Orders', value: 'orders' },
  { label: 'Settings', value: 'settings' }
];
</script>

<style scoped>
@import './ProfilePage.css';
</style>
