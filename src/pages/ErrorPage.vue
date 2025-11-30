<template>
  <div class="error-page">
    <div class="glass-card">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Page Not Found</h2>
      <p class="error-message">
        Oops! The page you are looking for seems to have evaporated.
      </p>
      <LiquidButton 
        text="Go Home" 
        type="primary" 
        icon="home" 
        @click="goHome" 
        class="home-btn"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg-color);
  padding: var(--spacing-lg);
}

.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  text-align: center;
  max-width: 400px;
  width: 100%;
  box-shadow: var(--glass-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.error-code {
  font-size: 6rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--text-color);
  margin: 0;
}

.error-message {
  color: var(--text-secondary);
  font-size: var(--text-base);
  margin-bottom: var(--spacing-md);
}

.home-btn {
  width: 100%;
}
</style>
