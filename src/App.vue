<template>
  <div id="app" data-theme="chic">
    <router-view />
    <LiquidToast />
  </div>
</template>

<script setup>
import LiquidToast from './components/liquid-ui-kit/LiquidToast/LiquidToast.vue';
</script>

<style>
@import './styles/variables.css';
@import './styles/main.css';
@import './styles/animations.css';
@import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round');

#app {
  min-height: 100vh;
  background-color: var(--bg-color);
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
