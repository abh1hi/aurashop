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

const { initAuth } = useAuth();

onMounted(() => {
  initAuth();
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
</style>
