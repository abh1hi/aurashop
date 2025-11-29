<template>
  <div id="app" data-theme="chic">
    <div class="mobile-shell">
      <router-view />
    </div>
  </div>
</template>

<script setup>
// No script needed now
</script>

<style>
@import './styles/variables.css';
@import './styles/main.css';
@import './styles/animations.css';
@import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round');

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-color);
}

.mobile-shell {
  width: 100%;
  max-width: 420px;
  height: 880px;
  background-color: white;
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
