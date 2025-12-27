<template>
  <div id="app" data-theme="chic">
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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import LiquidToast from './components/liquid-ui-kit/LiquidToast/LiquidToast.vue';
import { useAuth } from './composables/useAuth';
import { useAdminTheme } from './Admin_Pages/composables/useAdminTheme';

const { initAuth } = useAuth();
const { currentAdminTheme } = useAdminTheme(); // Initialize theme

onMounted(() => {
  initAuth();
});
</script>

<style>
/* Admin Specific Global Styles are loaded via main-admin.ts -> admin-theme.css */
#app {
  min-height: 100vh;
}
</style>
