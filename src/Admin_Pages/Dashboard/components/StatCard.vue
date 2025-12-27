<template>
  <div class="stat-card" :class="[variant, trendStatus]">
    <div class="stat-main">
      <div class="stat-info">
        <span class="stat-label">{{ title }}</span>
        <div class="stat-value">{{ value }}</div>
      </div>
      <div class="stat-icon-wrap">
        <span class="material-icons-round">{{ icon }}</span>
      </div>
    </div>
    
    <div class="stat-footer">
      <div class="trend-badge" :class="trendStatus">
        <span class="material-icons-round">{{ trendStatus === 'up' ? 'trending_up' : 'trending_down' }}</span>
        {{ trendValue }}
      </div>
      <span class="trend-label">Relative to phase</span>
    </div>
    <md-ripple></md-ripple>
  </div>
</template>

<script setup lang="ts">
import '@material/web/ripple/ripple.js';

defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, default: 'analytics' },
  trendValue: { type: String, default: '0%' },
  trendStatus: { type: String, default: 'up' }, // 'up' | 'down'
  variant: { type: String, default: 'default' } // 'default' | 'primary'
});
</script>

<style scoped src="./StatCard.css"></style>
