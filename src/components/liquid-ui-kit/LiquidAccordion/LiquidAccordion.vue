<template>
  <div class="accordion">
    <slot></slot>
  </div>
</template>

<script setup>
import { provide, ref } from 'vue';

const activeItem = ref(null);

const toggleItem = (id) => {
  if (activeItem.value === id) {
    activeItem.value = null;
  } else {
    activeItem.value = id;
  }
};

provide('accordion', {
  activeItem,
  toggleItem
});
</script>

<style scoped>
@import './LiquidAccordion.css';
</style>
