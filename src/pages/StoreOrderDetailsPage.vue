<template>
  <div class="page-container">
    <AppHeader />
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">arrow_back</span>
        Back to Orders
      </div>
      <div class="page-header">
        <h1 class="page-title">Order Details</h1>
      </div>
      <div class="content-placeholder">
        <span class="material-icons-round">construction</span>
        <p>Order Details page is under construction.</p>
        <p class="sub-text">Order ID: {{ route.params.orderId }}</p>
      </div>
    </main>
    <BottomNavBar />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';

const route = useRoute();
const router = useRouter();
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  background-image: var(--gradient-mesh);
  background-attachment: fixed;
  background-size: cover;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 24px;
  font-weight: 600;
  width: fit-content;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 24px;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  backdrop-filter: blur(var(--glass-blur));
  color: var(--text-secondary);
  text-align: center;
}

.content-placeholder .material-icons-round {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.sub-text {
  font-size: 0.9rem;
  margin-top: 8px;
  font-family: monospace;
}
</style>
