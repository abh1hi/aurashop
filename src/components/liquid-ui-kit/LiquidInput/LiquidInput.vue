<template>
  <div class="input-group">
    <div class="input-wrapper">
      <span v-if="icon && iconPosition === 'left'" class="material-icons-round input-icon input-icon-start">{{ icon }}</span>
      <input
        :class="inputClasses"
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <span v-if="icon && iconPosition === 'right'" class="material-icons-round input-icon input-icon-end">{{ icon }}</span>
    </div>
  </div>
</template>

<script setup>
import { liquidInputProps, useLiquidInput } from './LiquidInput';

const props = defineProps(liquidInputProps);
const emit = defineEmits(['update:modelValue']);
const { inputClasses } = useLiquidInput(props);
</script>

<style scoped>
@import './LiquidInput.css';
</style>
