<template>
  <button :class="buttonClasses" @click="handleClick" :disabled="disabled || loading">
    <span v-if="loading" class="material-icons-round spin">refresh</span>
    <span v-else-if="icon && iconPosition === 'left'" class="material-icons-round">{{ icon }}</span>
    <span v-if="text">{{ text }}</span>
    <span v-if="!loading && icon && iconPosition === 'right'" class="material-icons-round">{{ icon }}</span>
  </button>
</template>

<script setup>
import { liquidButtonProps, useLiquidButton } from './LiquidButton';

const props = defineProps(liquidButtonProps);
const { buttonClasses, handleClick } = useLiquidButton(props);
</script>

<style scoped>
@import './LiquidButton.css';
</style>
