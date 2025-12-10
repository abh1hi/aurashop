<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div v-for="toast in toasts" :key="toast.id" :class="['toast', `toast-${toast.type}`]">
        <span class="material-icons-round toast-icon">{{ getIcon(toast.type) }}</span>
        <span>{{ toast.message }}</span>
        <button class="toast-close" @click="removeToast(toast.id)">
            <span class="material-icons-round" style="font-size: 18px;">close</span>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from './LiquidToast';
import './LiquidToast.css';

const { toasts, removeToast } = useToast();

const getIcon = (type) => {
    if (type === 'success') return 'check_circle';
    if (type === 'error') return 'error';
    if (type === 'info') return 'info';
    if (type === 'warning') return 'warning';
    return 'info';
};
</script>
