<template>
  <header class="app-header">
    <div class="container header-content">
      <!-- Mobile Header -->
      <div class="mobile-header">
        <div class="location-wrapper">
          <span class="location-label">Location</span>
          <router-link to="/map" class="location-selector" style="text-decoration: none;">
            <span class="material-icons-round location-icon">location_on</span>
            <span class="location-text">{{ location.address || location }}</span>
            <span class="material-icons-round expand-icon">expand_more</span>
          </router-link>
        </div>
        <div class="header-actions">
          <LiquidButton icon="shopping_bag" type="ghost" class="icon-btn-override" />
          <LiquidButton icon="notifications_none" type="ghost" class="icon-btn-override" />
        </div>
      </div>

      <!-- Desktop Header -->
      <div class="desktop-header">
        <div class="brand-logo">
          <span class="material-icons-round logo-icon">diamond</span>
          <span class="brand-name">AuraShop</span>
        </div>
        
        <nav class="desktop-nav">
          <router-link to="/" class="nav-link" active-class="active">Home</router-link>
          <a href="#" class="nav-link">New Arrivals</a>
          <a href="#" class="nav-link">Brands</a>
        </nav>

        <div class="desktop-actions">
           <router-link to="/map" class="location-selector desktop-location" style="text-decoration: none; margin-right: 12px;">
             <span class="material-icons-round location-icon">location_on</span>
             <span class="location-text">{{ location.address || location }}</span>
           </router-link>
           <LiquidThemeSwitcher />
           <div class="desktop-search-wrapper">
              <LiquidInput placeholder="Search for products..." icon="search" class="desktop-search-input" />
           </div>
           <LiquidButton icon="favorite_border" type="ghost" class="icon-btn-override" />
           <LiquidButton icon="shopping_bag" type="ghost" class="icon-btn-override" />
           
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
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidInput from './liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidThemeSwitcher from './LiquidThemeSwitcher.vue';
import { useLocation } from '../composables/useLocation.js';
import { useAuth } from '../composables/useAuth';

const { location, detectLocation } = useLocation();
const { user } = useAuth();

onMounted(() => {
    detectLocation();
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

