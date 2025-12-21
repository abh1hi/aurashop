<template>
  <div class="not-authorized-container">
    <div class="content-box">
      <span class="material-icons-round lock-icon">lock</span>
      <h1>Access Denied</h1>
      <p>You do not have permission to access the Administrator Portal.</p>
      <div class="actions">
        <button class="btn-primary" @click="goHome">Return to Store</button>
        <button class="btn-ghost" @click="goToLogin">Sign In as Admin</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const goHome = () => {
  window.location.href = '/';
};

const goToLogin = () => {
  window.location.href = '/login';
};
</script>

<style scoped>
.not-authorized-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  color: #fff;
  font-family: 'Inter', sans-serif;
}

.content-box {
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  max-width: 400px;
  width: 90%;
}

.lock-icon {
  font-size: 64px;
  color: #e94560;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-weight: 500;
}

.btn-primary {
  background: #e94560;
  color: white;
}

.btn-primary:hover {
  background: #d63d56;
  transform: translateY(-2px);
}

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.4);
}
</style>
