<template>
  <button :class="buttonClasses" @click="handleClick">
    <span v-if="icon && iconPosition === 'left'" class="material-icons-round">{{ icon }}</span>
    <span v-if="text">{{ text }}</span>
    <span v-if="icon && iconPosition === 'right'" class="material-icons-round">{{ icon }}</span>
  </button>
</template>

<script setup>
import { liquidButtonProps, useLiquidButton } from './LiquidButton.js';

const props = defineProps(liquidButtonProps);
const { buttonClasses, handleClick } = useLiquidButton(props);
</script>

<style scoped>
@import './LiquidButton.css';
</style>
