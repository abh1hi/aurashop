<template>
  <div class="m3-auth-container">
    <div class="m3-auth-card">
      <md-icon class="lock-icon">lock_person</md-icon>
      <h1 class="headline-large">Access Restricted</h1>
      <p class="body-large">You do not have the required permissions to access the Administration Portal.</p>
      
      <div class="actions">
        <md-filled-button @click="goHome">
            Return to Store
        </md-filled-button>
        <md-text-button @click="goToLogin">
            Sign In as Administrator
        </md-text-button>
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
.m3-auth-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--md-sys-color-surface-container-lowest);
    color: var(--md-sys-color-on-surface);
}

.m3-auth-card {
    background: var(--md-sys-color-surface);
    padding: 48px;
    border-radius: 28px;
    text-align: center;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

.lock-icon {
    font-size: 64px;
    color: var(--md-sys-color-error);
    margin-bottom: 8px;
}

.headline-large {
    font-family: var(--md-sys-typescale-headline-large-font);
    font-size: 1.75rem;
    font-weight: 400;
    margin: 0;
}

.body-large {
    color: var(--md-sys-color-on-surface-variant);
    margin: 0;
}

.actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 24px;
    width: 100%;
}
</style>
