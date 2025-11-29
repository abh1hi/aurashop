<template>
  <header class="app-header">
    <div class="container header-content">
      <!-- Mobile Header -->
      <div class="mobile-header">
        <div class="location-wrapper">
          <span class="location-label">Location</span>
          <router-link to="/map" class="location-selector" style="text-decoration: none;">
            <span class="material-icons-round location-icon">location_on</span>
            <span class="location-text">{{ location }}</span>
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
          <a href="#" class="nav-link active">Home</a>
          <a href="#" class="nav-link">New Arrivals</a>
          <a href="#" class="nav-link">Brands</a>
        </nav>

        <div class="desktop-actions">
           <router-link to="/map" class="location-selector desktop-location" style="text-decoration: none; margin-right: 12px;">
             <span class="material-icons-round location-icon">location_on</span>
             <span class="location-text">{{ location }}</span>
           </router-link>
           <LiquidThemeSwitcher />
           <div class="desktop-search-wrapper">
              <LiquidInput placeholder="Search for products..." icon="search" class="desktop-search-input" />
           </div>
           <LiquidButton icon="favorite_border" type="ghost" class="icon-btn-override" />
           <LiquidButton icon="shopping_bag" type="ghost" class="icon-btn-override" />
           <LiquidButton icon="person_outline" type="ghost" class="icon-btn-override" />
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

const { location, detectLocation } = useLocation();

onMounted(() => {
    detectLocation();
});
</script>

<style scoped>
@import './AppHeader.css';
</style>

