<template>
  <header class="app-header" :class="{ 'is-scrolled': scrollY > 10 }">
    <!-- Minimal Header (Stage 3) -->
    <div class="minimal-header" :class="{ 'visible': showMinimalHeader }">
        <div class="container minimal-content">
            <div class="minimal-location">
                <span class="material-icons-round location-icon">place</span>
                <span class="location-text">{{ location.address ? location.address.split(',')[0] : 'Select Location' }}</span>
            </div>
        </div>
    </div>

    <div class="container header-content" :class="{ 'hidden': showMinimalHeader }">
      <!-- Mobile Header -->
      <div class="mobile-header" :class="{ 'compact': hideTopBar }">
        <div class="brand-logo-mobile">
            <span class="material-icons-round logo-icon">diamond</span>
            <span class="brand-name">Aura</span>
        </div>
        
        <div class="location-wrapper-mobile">
          <router-link to="/map" class="location-pill">
            <span class="material-icons-round location-icon">place</span>
            <span class="location-text">{{ location.address ? location.address.split(',')[0] : 'Select Location' }}</span>
          </router-link>
        </div>

        <div class="header-actions">
          <LiquidButton icon="notifications_none" type="ghost" class="icon-btn-glass" />
        </div>
      </div>
      
      <!-- Mobile Breadcrumbs -->
      <div class="mobile-breadcrumbs" :class="{ 'collapsed': hideBottomBar }">
        <LiquidBreadcrumbs />
      </div>

      <!-- Desktop Header -->
      <div class="desktop-header">
        <!-- Top Bar: Logo | Search | Actions (Stage 1 Hide) -->
        <div class="header-top-bar" :class="{ 'collapsed': hideTopBar }">
            <div class="brand-logo">
              <div class="logo-circle">
                <span class="material-icons-round logo-icon">diamond</span>
              </div>
              <span class="brand-name">AuraShop</span>
            </div>

            <div class="desktop-search-wrapper">
               <div class="search-bar-glass">
                  <span class="material-icons-round search-icon">search</span>
                  <input type="text" placeholder="Search for products, brands and more..." />
                  <LiquidButton icon="search" type="primary" size="sm" class="search-btn-inner" />
               </div>
            </div>

            <div class="desktop-actions">
               <router-link to="/map" class="action-item">
                 <span class="material-icons-round action-icon">location_on</span>
                 <div class="action-label">
                    <span class="label-tiny">Location</span>
                    <span class="label-main">{{ location.address ? location.address.split(',')[0] : 'Select' }}</span>
                 </div>
               </router-link>
               
               <div class="action-divider"></div>

               <LiquidThemeSwitcher />
               
               <button class="action-btn">
                 <span class="material-icons-round">favorite_border</span>
               </button>
               
               <button class="action-btn cart-btn">
                 <span class="material-icons-round">shopping_bag</span>
                 <span class="badge">2</span>
               </button>
               
               <router-link v-if="user" to="/profile" class="profile-link">
                 <div class="header-avatar">
                   <img :src="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.email || 'User')" alt="User" />
                 </div>
               </router-link>
               <router-link v-else to="/login">
                 <LiquidButton text="Login" type="primary" size="sm" />
               </router-link>
            </div>
        </div>
        
        <!-- Bottom Bar: Nav | Breadcrumbs (Stage 2 Hide) -->
        <div class="header-bottom-bar" :class="{ 'collapsed': hideBottomBar }">
            <nav class="desktop-nav">
              <div class="nav-category-btn">
                <span class="material-icons-round">grid_view</span>
                <span>All Categories</span>
              </div>
              <div class="nav-links">
                  <router-link to="/" class="nav-item" active-class="active">Home</router-link>
                  <a href="#" class="nav-item">Electronics</a>
                  <a href="#" class="nav-item">Fashion</a>
                  <a href="#" class="nav-item">Home</a>
                  <a href="#" class="nav-item">Beauty</a>
                  <a href="#" class="nav-item highlight">Best Deals</a>
              </div>
            </nav>
            
            <div class="breadcrumbs-wrapper">
                <LiquidBreadcrumbs />
            </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidThemeSwitcher from './LiquidThemeSwitcher.vue';
import LiquidBreadcrumbs from './liquid-ui-kit/LiquidBreadcrumbs/LiquidBreadcrumbs.vue';
import { useLocation } from '../composables/useLocation';
import { useAuth } from '../composables/useAuth';

const { location, detectLocation } = useLocation();
const { user } = useAuth();

const scrollY = ref(0);
const hideTopBar = ref(false);
const hideBottomBar = ref(false);
const showMinimalHeader = ref(false);

const handleScroll = () => {
    scrollY.value = window.scrollY;
    
    // Stage 1: Hide Top Bar > 50px
    hideTopBar.value = scrollY.value > 50;
    
    // Stage 2: Hide Bottom Bar > 150px
    hideBottomBar.value = scrollY.value > 150;
    
    // Stage 3: Show Minimal Header > 300px
    showMinimalHeader.value = scrollY.value > 300;
};

onMounted(() => {
    detectLocation();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@import './AppHeader.css';

.header-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--brand-primary);
  cursor: pointer;
}

.header-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

