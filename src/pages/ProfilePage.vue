<template>
  <div class="page-container">
    <!-- Background Elements -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      
      <!-- DESKTOP VIEW -->
      <div class="desktop-view fade-in">
        <!-- Sidebar Navigation -->
        <aside class="desktop-sidebar">
          <LiquidCard class="sidebar-profile-card">
            <div class="avatar-wrapper-desktop">
              <img 
                :src="userProfile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userProfile?.email || 'User')" 
                alt="Avatar" 
                class="avatar-desktop"
              />
            </div>
            <h1 class="sidebar-name">{{ userProfile?.displayName || (isAnonymous ? 'Guest User' : 'User') }}</h1>
            <p class="sidebar-handle">@{{ userProfile?.username || (isAnonymous ? 'guest' : 'username') }}</p>
            
            <nav class="sidebar-nav">
              <button 
                v-for="tab in tabs" 
                :key="tab.value"
                class="nav-item-btn"
                :class="{ active: activeTab === tab.value }"
                @click="activeTab = tab.value"
              >
                <span class="material-icons-round">{{ getTabIcon(tab.value) }}</span>
                <span>{{ tab.label }}</span>
              </button>
              
              <!-- Additional Quick Links for Feature Parity -->
              <button class="nav-item-btn" @click="openAddressBook">
                <span class="material-icons-round">place</span>
                <span>Address Book</span>
              </button>
              <button class="nav-item-btn" @click="router.push('/wishlist')">
                <span class="material-icons-round">favorite</span>
                <span>Wishlist</span>
              </button>
              <button v-if="!userProfile?.roles?.includes('vendor')" class="nav-item-btn" @click="handleCreateStore">
                <span class="material-icons-round">add_business</span>
                <span>Become a Vendor</span>
              </button>
              <button v-else class="nav-item-btn" @click="router.push('/vendor/my-stores')">
                <span class="material-icons-round">storefront</span>
                <span>Manage Stores</span>
              </button>
            </nav>

            <div class="sidebar-footer mt-xl">
               <LiquidButton 
                text="Edit Profile" 
                size="md" 
                icon="edit" 
                type="secondary"
                class="w-100 mb-md"
                @click="router.push('/profile/edit')"
              />
              <LiquidButton 
                text="Log Out" 
                size="md" 
                icon="logout" 
                type="ghost"
                class="w-100 text-danger"
                @click="handleLogout"
              />
            </div>
          </LiquidCard>
        </aside>

        <!-- Main Content Area -->
        <section class="desktop-main-content">
          <header class="content-header">
            <h2>{{ getTabLabel(activeTab) }}</h2>
          </header>

          <!-- OVERVIEW TAB -->
          <div v-if="activeTab === 'overview'" class="content-fade-in">
            <div class="stats-grid mb-xl">
              <LiquidCard class="stat-card">
                <span class="stat-value">{{ userProfile?.addresses?.length || 0 }}</span>
                <span class="stat-label">Addresses</span>
              </LiquidCard>
              <LiquidCard class="stat-card">
                <span class="stat-value">{{ userProfile?.roles?.includes('vendor') ? '1' : '0' }}</span>
                <span class="stat-label">Stores</span>
              </LiquidCard>
              <LiquidCard class="stat-card">
                <span class="stat-value">{{ userProfile?.roles?.length || 1 }}</span>
                <span class="stat-label">Roles</span>
              </LiquidCard>
            </div>

            <div class="content-layout-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
              <LiquidCard class="section-card">
                <h3>Account Details</h3>
                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">Email</span>
                    <span class="info-value">{{ userProfile?.email }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Phone</span>
                    <span class="info-value">{{ userProfile?.phoneNumber || 'Not provided' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Member Since</span>
                    <span class="info-value">{{ userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A' }}</span>
                  </div>
                </div>
              </LiquidCard>

              <LiquidCard class="section-card">
                <h3>Primary Shipping</h3>
                <div v-if="userProfile?.addresses?.length" class="address-item">
                  <div class="address-icon-box">
                    <span class="material-icons-round">home</span>
                  </div>
                  <div class="address-info">
                    <span class="address-name">{{ userProfile.addresses[0].label }}</span>
                    <p class="address-detail">{{ userProfile.addresses[0].addressLine }}</p>
                  </div>
                  <LiquidButton text="Edit" size="sm" type="ghost" @click="editAddress(userProfile.addresses[0].id)" />
                </div>
                <div v-else class="empty-placeholder" style="text-align: center; padding: 20px;">
                  <p class="text-secondary">No addresses saved.</p>
                  <LiquidButton text="Add Address" size="sm" type="primary" @click="addNewAddress" />
                </div>
              </LiquidCard>
            </div>
          </div>

          <!-- ORDERS TAB -->
          <div v-if="activeTab === 'orders'" class="content-fade-in">
            <LiquidCard class="section-card">
              <div class="empty-placeholder" style="text-align: center; padding: 60px;">
                <span class="material-icons-round" style="font-size: 48px; opacity: 0.3; margin-bottom: 16px; display: block;">shopping_bag</span>
                <h3>No Orders Yet</h3>
                <p class="text-secondary mb-xl">Your shopping journey starts here. Explore our collection.</p>
                <LiquidButton text="Start Shopping" type="primary" @click="router.push('/')" />
              </div>
            </LiquidCard>
          </div>

          <!-- SETTINGS TAB -->
          <div v-if="activeTab === 'settings'" class="content-fade-in">
             <LiquidCard class="section-card">
                <h3>App Preferences</h3>
                <div class="info-item mb-md">
                   <div class="info-meta">
                      <span class="info-label">Liquid Animations</span>
                      <p class="text-secondary text-sm">Enable fluid transitions and glass effects</p>
                   </div>
                   <LiquidToggle 
                      :modelValue="liquidAnimationsEnabled" 
                      @update:modelValue="toggleLiquidAnimations" 
                    />
                </div>
                <div class="info-item">
                   <div class="info-meta">
                      <span class="info-label">Interface Theme</span>
                      <p class="text-secondary text-sm">Choose your preferred visual aesthetic</p>
                   </div>
                   <LiquidDropdown 
                      :modelValue="currentTheme" 
                      :options="filteredThemeOptions" 
                      @update:modelValue="setTheme"
                      placeholder="Select Theme"
                      style="width: 200px"
                    />
                </div>
             </LiquidCard>
          </div>
        </section>
      </div>

      <!-- MOBILE VIEW -->
      <div class="mobile-view fade-in">
        <LiquidCard class="mobile-profile-hero">
          <div class="avatar-wrapper-mobile">
            <img 
              :src="userProfile?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (userProfile?.email || 'User')" 
              alt="Avatar" 
              class="avatar-mobile"
            />
          </div>
          <h2 class="m-name">{{ userProfile?.displayName || 'Guest' }}</h2>
          <p class="m-handle">@{{ userProfile?.username || 'guest' }}</p>
          
          <div class="m-quick-stats">
            <div class="m-stat-item">
              <span class="m-stat-value">{{ userProfile?.addresses?.length || 0 }}</span>
              <span class="m-stat-label">Addresses</span>
            </div>
            <div class="m-stat-item">
              <span class="m-stat-value">{{ userProfile?.roles?.includes('vendor') ? '1' : '0' }}</span>
              <span class="m-stat-label">Stores</span>
            </div>
          </div>
        </LiquidCard>

        <div class="mobile-menus-container">
          <div class="menu-group">
            <h3 class="mobile-section-title">Account</h3>
            <div class="mobile-menu-card">
               <div class="m-menu-item" @click="router.push('/profile/edit')">
                  <div class="m-icon-box"><span class="material-icons-round">edit</span></div>
                  <span class="m-menu-label">Edit Profile</span>
                  <span class="material-icons-round m-chevron">chevron_right</span>
               </div>
               <div class="m-menu-item" @click="openAddressBook">
                  <div class="m-icon-box"><span class="material-icons-round">place</span></div>
                  <span class="m-menu-label">Address Book</span>
                  <span class="material-icons-round m-chevron">chevron_right</span>
               </div>
               <div class="m-menu-item" @click="router.push('/orders')">
                  <div class="m-icon-box"><span class="material-icons-round">shopping_bag</span></div>
                  <span class="m-menu-label">My Orders</span>
                  <span class="material-icons-round m-chevron">chevron_right</span>
               </div>
               <div class="m-menu-item" @click="router.push('/wishlist')">
                  <div class="m-icon-box"><span class="material-icons-round">favorite</span></div>
                  <span class="m-menu-label">Wishlist</span>
                  <span class="material-icons-round m-chevron">chevron_right</span>
               </div>
            </div>
          </div>

          <div class="menu-group">
            <h3 class="mobile-section-title">Business</h3>
            <div class="mobile-menu-card">
               <div v-if="userProfile?.roles?.includes('vendor')" class="m-menu-item" @click="router.push('/vendor/my-stores')">
                  <div class="m-icon-box"><span class="material-icons-round">storefront</span></div>
                  <span class="m-menu-label">Manage Stores</span>
                  <span class="material-icons-round m-chevron">chevron_right</span>
               </div>
               <div v-else class="m-menu-item" @click="handleCreateStore">
                  <div class="m-icon-box"><span class="material-icons-round">add_business</span></div>
                  <span class="m-menu-label">Become a Vendor</span>
                  <span class="material-icons-round m-chevron">chevron_right</span>
               </div>
            </div>
          </div>

          <div class="menu-group">
            <h3 class="mobile-section-title">App Settings</h3>
            <div class="mobile-menu-card">
               <div class="m-menu-item">
                  <div class="m-icon-box"><span class="material-icons-round">palette</span></div>
                  <span class="m-menu-label">Theme</span>
                  <LiquidDropdown 
                    class="mini-dropdown"
                    :modelValue="currentTheme" 
                    :options="filteredThemeOptions" 
                    @update:modelValue="setTheme"
                 />
               </div>
               <div class="m-menu-item" @click="handleLogout">
                  <div class="m-icon-box bg-danger-soft"><span class="material-icons-round text-danger">logout</span></div>
                  <span class="m-menu-label text-danger">Log Out</span>
               </div>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- Address Book Action Sheet -->
    <LiquidActionSheet
        v-model="showAddressBookSheet"
        title="Address Book"
        subtitle="Manage your shipping locations"
    >
        <div class="address-book-content">
            <div v-if="!userProfile?.addresses?.length" class="empty-placeholder" style="text-align: center; padding: 40px;">
                <span class="material-icons-round empty-icon" style="font-size: 48px; opacity: 0.2; margin-bottom: 12px; display: block;">location_off</span>
                <p class="text-secondary">You haven't added any addresses yet.</p>
            </div>
            
            <div class="address-list" style="display: flex; flex-direction: column; gap: 12px;">
                <div v-for="addr in userProfile?.addresses" :key="addr.id" class="address-card" style="display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid var(--liquid-glass-border); border-radius: 16px;">
                    <div class="address-icon" style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-pastel); display: flex; align-items: center; justify-content: center; color: var(--brand-primary);">
                        <span class="material-icons-round">place</span>
                    </div>
                    <div class="address-details" style="flex: 1;">
                        <span class="address-label" style="display: block; font-weight: 700;">{{ addr.label }}</span>
                        <p class="address-text" style="font-size: 0.9rem; color: var(--secondary-text); margin: 0;">{{ addr.addressLine }}</p>
                    </div>
                    <div class="address-actions" style="display: flex; gap: 8px;">
                        <LiquidButton icon="edit" type="ghost" size="sm" @click="editAddress(addr.id)" />
                        <LiquidButton icon="delete" type="ghost" size="sm" class="delete-btn" @click="confirmDeleteAddress(addr.id)" />
                    </div>
                </div>
            </div>

            <LiquidButton 
                text="Add New Address" 
                icon="add_location" 
                type="primary" 
                size="lg"
                class="w-100 mt-xl" 
                @click="addNewAddress" 
            />
        </div>
    </LiquidActionSheet>

    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidToggle from '../components/liquid-ui-kit/LiquidToggle/LiquidToggle.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidActionSheet from '../components/liquid-ui-kit/LiquidActionSheet/LiquidActionSheet.vue';
import { useProfilePage } from './ProfilePage';

const {
    router,
    userProfile,
    isAnonymous,
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
    filteredThemeOptions,
    activeTab,
    getTabIcon,
    getTabLabel,
    handleCreateStore,
} = useProfilePage();

const tabs = [
  { label: 'Overview', value: 'overview' },
  { label: 'My Orders', value: 'orders' },
  { label: 'Settings', value: 'settings' }
];
</script>

<style scoped src="./ProfilePage.css"></style>
