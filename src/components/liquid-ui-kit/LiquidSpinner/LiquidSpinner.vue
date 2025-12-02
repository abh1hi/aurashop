<template>
  <div class="spinner" :class="[`spinner-${variant}`, size]">
    <template v-if="variant === 'dots'">
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
      <div class="spinner-dot"></div>
    </template>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  variant: {
    type: String,
    default: 'circle', // 'circle' or 'dots'
    validator: (value) => ['circle', 'dots'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});
</script>

<style scoped src="./LiquidSpinner.css"></style>
