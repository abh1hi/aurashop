<template>
  <header 
    class="app-header" 
    :class="{ 
      'is-scrolled': scrollY > 20,
      'is-hidden': scrollY > 50 && scrollDirection === 'down'
    }"
  >
    <!-- DESKTOP HEADER -->
    <div class="header-container desktop-only-flex">
      <router-link to="/" class="brand-section">
        <div class="logo-sphere">
          <span class="material-icons-round">diamond</span>
        </div>
        <span class="brand-name">AuraShop</span>
      </router-link>

      <div class="search-and-location">
        <div class="location-pill-desktop" @click="router.push('/map')">
          <span class="material-icons-round">place</span>
          <span class="loc-text">{{ location.address ? location.address.split(',')[0] : 'Set Location' }}</span>
        </div>
        
        <div class="search-bar-refined">
          <span class="material-icons-round search-icon-dim">search</span>
          <input type="text" placeholder="Search for products..." />
          <button class="search-btn-inner">
            <span class="material-icons-round">arrow_forward</span>
          </button>
        </div>
      </div>

      <div class="actions-section">
        <LiquidThemeSwitcher />
        <button class="icon-action-btn"><span class="material-icons-round">favorite_border</span></button>
        <router-link to="/cart" class="icon-action-btn">
          <span class="material-icons-round">shopping_bag</span>
          <span class="dot-badge"></span>
        </router-link>
        <router-link v-if="user" to="/profile" class="profile-trigger">
          <img :src="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.email || 'User')" alt="User" class="avatar-mini" />
          <span class="user-first-name">{{ user.displayName?.split(' ')[0] || 'Me' }}</span>
        </router-link>
        <router-link v-else to="/login">
          <LiquidButton text="Sign In" type="primary" size="sm" />
        </router-link>
      </div>
    </div>

    <!-- MOBILE HEADER (Different UI) -->
    <div class="header-container mobile-only-flex">
      <div class="mobile-left">
        <router-link to="/" class="mobile-logo">
           <span class="material-icons-round">diamond</span>
        </router-link>
        <div class="mobile-location-pill" @click="router.push('/map')">
          <span class="material-icons-round">place</span>
          <span class="loc-text">{{ location.address ? location.address.split(',')[0] : 'Location' }}</span>
        </div>
      </div>

      <div class="mobile-right">
        <button class="icon-action-btn"><span class="material-icons-round">search</span></button>
        <router-link to="/cart" class="icon-action-btn">
          <span class="material-icons-round">shopping_bag</span>
          <span class="dot-badge"></span>
        </router-link>
        <router-link v-if="user" to="/profile" class="mobile-avatar-link">
          <img :src="user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.email || 'User')" alt="User" class="avatar-mini" />
        </router-link>
        <router-link v-else to="/login" class="mobile-login-icon">
          <span class="material-icons-round">account_circle</span>
        </router-link>
      </div>
    </div>

    <!-- Breadcrumbs Section -->
    <div 
      class="header-bottom-area" 
      v-if="!isHomePage && showBreadcrumbs"
      :class="{ 'hiding': scrollY > 10 }"
    >
      <div class="container breadcrumb-wrap">
        <LiquidBreadcrumbs :minimized="isBreadcrumbsMinimized" />
        <button 
          class="breadcrumb-control-btn" 
          @click="toggleBreadcrumbMode"
          :title="isBreadcrumbsMinimized ? 'Maximize' : 'Minimize'"
        >
          <span class="material-icons-round">
            {{ isBreadcrumbsMinimized ? 'unfold_more' : 'unfold_less' }}
          </span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LiquidButton from './liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidThemeSwitcher from './LiquidThemeSwitcher.vue';
import LiquidBreadcrumbs from './liquid-ui-kit/LiquidBreadcrumbs/LiquidBreadcrumbs.vue';
import { useAuth } from '../composables/useAuth';
import { useLocation } from '../composables/useLocation';

const router = useRouter();
const route = useRoute();
const { user } = useAuth();
const { location, detectLocation } = useLocation();

const scrollY = ref(0);
const lastScrollY = ref(0);
const scrollDirection = ref<'up' | 'down'>('up');

const isHomePage = computed(() => route.path === '/');

const showBreadcrumbs = ref(localStorage.getItem('breadcrumbs_visible') !== 'false');
const isBreadcrumbsMinimized = ref(localStorage.getItem('breadcrumbs_minimized') === 'true');

const toggleBreadcrumbMode = () => {
    isBreadcrumbsMinimized.value = !isBreadcrumbsMinimized.value;
    localStorage.setItem('breadcrumbs_minimized', isBreadcrumbsMinimized.value.toString());
};

const handleScroll = () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > lastScrollY.value && currentScrollY > 50) {
        scrollDirection.value = 'down';
    } else {
        scrollDirection.value = 'up';
    }
    
    scrollY.value = currentScrollY;
    lastScrollY.value = currentScrollY;
};

onMounted(() => {
    detectLocation();
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@import './AppHeader.css';

/* Visibility Controllers */
.desktop-only-flex {
    display: none;
}

.mobile-only-flex {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

@media (min-width: 1024px) {
    .desktop-only-flex {
        display: flex;
    }
    .mobile-only-flex {
        display: none;
    }
}

/* Mobile Specific UI */
.mobile-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.mobile-right {
    display: flex;
    align-items: center;
    gap: 4px;
}

.mobile-logo {
    color: var(--brand-primary);
    display: flex;
    font-size: 24px;
    text-decoration: none;
}

.mobile-location-pill {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
    border-radius: var(--radius-full);
    font-size: 11px;
    font-weight: 700;
    color: var(--primary-text);
    max-width: 110px;
}

.mobile-location-pill .material-icons-round {
    font-size: 14px;
    color: var(--brand-primary);
}

.mobile-avatar-link {
    display: flex;
    margin-left: 4px;
}

.mobile-login-icon {
    color: var(--secondary-text);
    display: flex;
}
</style>
