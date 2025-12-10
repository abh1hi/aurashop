<template>
  <div :class="cardClasses">
    <template v-if="variant === 'liquid'">
      <div class="liquidGlass-effect"></div>
      <div class="liquidGlass-tint"></div>
      <div class="liquidGlass-shine"></div>
      <div class="card-content" style="position: relative; z-index: 1;">
        <slot></slot>
      </div>
    </template>
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { liquidCardProps, useLiquidCard } from './LiquidCard';

const props = defineProps(liquidCardProps);
const { cardClasses } = useLiquidCard(props);
</script>

<style scoped>
@import './LiquidCard.css';
</style>
