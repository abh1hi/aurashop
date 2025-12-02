<template>
  <div class="stat-card" :class="variant">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="trend-icon">
        <span class="material-icons-round">north_east</span>
      </div>
    </div>
    
    <div class="value">{{ value }}</div>
    
    <div class="card-footer">
      <div class="trend-badge">
        <span class="material-icons-round" style="font-size: 14px;">trending_up</span>
        {{ trend }}
      </div>
      <span class="trend-text">Increased from last month</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  trend: { type: String, default: '10%' },
  variant: { type: String, default: 'default' } // 'default' | 'primary'
});
</script>

<style scoped src="./StatCard.css"></style>
