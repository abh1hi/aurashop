<template>
  <div class="stats-grid-container">
    <div v-for="(stat, index) in stats" :key="index" class="stat-card">
      <div class="stat-header">
        <span class="stat-title">{{ stat.title }}</span>
        <div class="stat-icon" :class="stat.iconClass || 'text-primary'">
          <span class="material-icons-round">{{ stat.icon }}</span>
        </div>
      </div>
      <div class="stat-value">{{ stat.value }}</div>
      <div v-if="stat.trend" class="stat-trend" :class="stat.trend.direction">
        <span class="material-icons-round text-sm">
          {{ stat.trend.direction === 'up' ? 'trending_up' : 'trending_down' }}
        </span>
        <span>{{ stat.trend.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  stats: {
    type: Array,
    required: true,
    // Expected format:
    // [
    //   { 
    //     title: 'Total Revenue', 
    //     value: '$45,231', 
    //     icon: 'attach_money', 
    //     iconClass: 'text-success',
    //     trend: { direction: 'up', label: '+20.1% from last month' } 
    //   }, ...
    // ]
  }
});
</script>

<style scoped src="./LiquidStats.css"></style>
