<template>
  <div id="app" data-theme="chic">
    <router-view />
    <LiquidToast />
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue';
import LiquidToast from './components/liquid-ui-kit/LiquidToast/LiquidToast.vue';
import { useAuth } from './composables/useAuth';
import { useToast } from './components/liquid-ui-kit/LiquidToast/LiquidToast.js';

const { initAuth, user, loginAnonymously } = useAuth();
const { showToast } = useToast();

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
