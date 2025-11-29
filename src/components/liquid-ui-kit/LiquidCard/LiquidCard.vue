<template>
  <div :class="cardClasses">
    <slot></slot>
  </div>
</template>

<script setup>
import { liquidCardProps, useLiquidCard } from './LiquidCard.js';

const props = defineProps(liquidCardProps);
const { cardClasses } = useLiquidCard(props);
</script>

<style scoped>
@import './LiquidCard.css';
</style>
