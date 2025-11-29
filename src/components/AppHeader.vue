<template>
  <header class="app-header">
    <div class="location-selector">
      <span class="material-icons-round">location_on</span>
      <span>London, Uk</span>
      <span class="material-icons-round">expand_more</span>
    </div>
    <div class="header-actions">
      <LiquidButton icon="shopping_bag" type="glass" />
      <LiquidButton icon="notifications" type="glass" />
    </div>
  </header>
</template>

<script setup>
import LiquidButton from './LiquidButton.vue';
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
}

.location-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Making the buttons smaller as in the image */
.header-actions .liquid-btn {
    padding: var(--spacing-sm);
}
</style>
