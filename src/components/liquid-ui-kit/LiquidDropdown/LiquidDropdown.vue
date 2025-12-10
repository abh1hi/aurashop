<template>
  <div class="dropdown-wrapper" ref="dropdownRef">
    <label v-if="label" class="dropdown-label">{{ label }}</label>
    <div class="dropdown" :class="{ open: isOpen }">
      <button class="dropdown-trigger" @click="toggleDropdown">
        <span class="selected-value">
          <span v-if="selectedOption" class="flex items-center gap-sm">
             <span v-if="selectedOption.icon" class="material-icons-round text-sm">{{ selectedOption.icon }}</span>
             {{ selectedOption.label }}
          </span>
          <span v-else>{{ placeholder }}</span>
        </span>
        <span class="material-icons-round dropdown-arrow">expand_more</span>
      </button>
      <div class="dropdown-menu">
        <div 
          v-for="option in options" 
          :key="option.value"
          class="dropdown-item" 
          :class="{ selected: modelValue === option.value }"
          @click="selectOption(option.value)"
        >
          <span v-if="option.icon" class="material-icons-round text-sm">{{ option.icon }}</span>
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { liquidDropdownProps, useLiquidDropdown } from './LiquidDropdown';

const props = defineProps(liquidDropdownProps);
const emit = defineEmits(['update:modelValue']);
const { isOpen, dropdownRef, selectedOption, toggleDropdown, selectOption } = useLiquidDropdown(props, emit);
</script>

<style scoped>
@import './LiquidDropdown.css';
</style>
