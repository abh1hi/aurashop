<template>
  <div id="app" data-theme="chic">
    <!-- Global SVG Filters for Liquid Effects -->
    <svg class="filters" style="position: absolute; width: 0; height: 0; pointer-events: none; z-index: -1;">
      <defs>
        <filter id="glass-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
        </filter>
        <filter id="switcher">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </defs>
    </svg>
    <router-view />
    <LiquidToast />
    <QuickViewModal />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import LiquidToast from './components/liquid-ui-kit/LiquidToast/LiquidToast.vue';
import QuickViewModal from './components/QuickViewModal.vue';
import { useAuth } from './composables/useAuth';
import { useToast } from './components/liquid-ui-kit/LiquidToast/LiquidToast';
import { useDataCollector } from './composables/useDataCollector';

const { initAuth, user, loginAnonymously } = useAuth();
const { showToast } = useToast();

// Initialize Data Collection
useDataCollector();

let guestTimer = null;

const startGuestTimer = () => {
  if (user.value) return;
  
  if (guestTimer) clearTimeout(guestTimer);
  
  guestTimer = setTimeout(async () => {
    if (!user.value) {
      try {
        await loginAnonymously();
        showToast('Ghost mode activated! 👻 Sign in to come back to life.', 'info');
      } catch (error) {
        console.error('Auto guest login failed:', error);
      }
    }
  }, 30000); // 30 seconds
};

const clearGuestTimer = () => {
  if (guestTimer) clearTimeout(guestTimer);
};

onMounted(() => {
  initAuth();
  startGuestTimer();
});

watch(user, (newUser) => {
  if (newUser) {
    clearGuestTimer();
  } else {
    startGuestTimer();
  }
});
</script>

<style>
@import './styles/variables.css';
@import './styles/main.css';
@import './styles/animations.css';
@import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round');

#app {
  min-height: 100vh;
  background-color: transparent;
  color: var(--text-color);
  font-family: var(--font-family);
}

/* Global Responsive Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}
</style>
