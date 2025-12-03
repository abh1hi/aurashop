<template>
  <section class="section-container season-countdown">
    <div class="season-content glass-panel">
      <div class="season-info">
        <h2 class="season-title">{{ seasonName }} Season</h2>
        <p class="season-subtitle">Ends in {{ daysLeft }} days</p>
        <div class="countdown-timer">
            <div class="timer-block">
                <span class="time-value">{{ hours }}</span>
                <span class="time-label">Hrs</span>
            </div>
            <span class="separator">:</span>
            <div class="timer-block">
                <span class="time-value">{{ minutes }}</span>
                <span class="time-label">Mins</span>
            </div>
            <span class="separator">:</span>
            <div class="timer-block">
                <span class="time-value">{{ seconds }}</span>
                <span class="time-label">Secs</span>
            </div>
        </div>
      </div>
      
      <div class="season-meter-wrapper">
        <div class="meter-label">
            <span>Season Progress</span>
            <span>{{ progress }}%</span>
        </div>
        <div class="meter-track">
            <div class="meter-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <LiquidButton text="Shop Season" type="primary" icon="arrow_forward" class="shop-btn" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LiquidButton from '../liquid-ui-kit/LiquidButton/LiquidButton.vue';

const seasonName = ref('Winter');
const daysLeft = ref(12);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const progress = ref(75);

let timerInterval;

const updateTimer = () => {
    const now = new Date();
    // Mock end date: 12 days from now
    const endDate = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000); 
    
    // Just a simple countdown simulation for the demo
    const diff = endDate - now;
    
    // Calculate hours, minutes, seconds based on a daily cycle for the visual timer
    // In a real app, this would be diff based
    const h = 23 - now.getHours();
    const m = 59 - now.getMinutes();
    const s = 59 - now.getSeconds();
    
    hours.value = h < 10 ? `0${h}` : h;
    minutes.value = m < 10 ? `0${m}` : m;
    seconds.value = s < 10 ? `0${s}` : s;
};

onMounted(() => {
    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
});

onUnmounted(() => {
    clearInterval(timerInterval);
});
</script>

<style scoped>
.section-container {
  padding: var(--spacing-lg);
  width: 100%;
  min-width: 0;
}

.season-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-2xl);
    border-radius: var(--radius-xl);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border: 1px solid var(--glass-border);
    text-align: center;
    gap: var(--spacing-xl);
    position: relative;
    overflow: hidden;
}

.season-content::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-pastel), var(--secondary-pastel));
}

.season-title {
    font-size: var(--text-3xl);
    font-weight: 800;
    color: var(--text-color);
    margin-bottom: var(--spacing-xs);
}

.season-subtitle {
    color: var(--text-secondary);
    font-size: var(--text-lg);
    margin-bottom: var(--spacing-lg);
}

.countdown-timer {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-family: monospace;
}

.timer-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--glass-bg);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    border: 1px solid var(--glass-border);
    min-width: 60px;
}

.time-value {
    font-size: var(--text-2xl);
    font-weight: bold;
    color: var(--brand-primary);
}

.time-label {
    font-size: var(--text-xs);
    color: var(--text-secondary);
    text-transform: uppercase;
}

.separator {
    font-size: var(--text-2xl);
    font-weight: bold;
    color: var(--text-disabled);
    margin-bottom: 16px; 
}

.season-meter-wrapper {
    width: 100%;
    max-width: 500px;
}

.meter-label {
    display: flex;
    justify-content: space-between;
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
}

.meter-track {
    height: 12px;
    background: rgba(0,0,0,0.05);
    border-radius: var(--radius-full);
    overflow: hidden;
    position: relative;
}

.meter-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--brand-primary), var(--secondary-pastel));
    border-radius: var(--radius-full);
    transition: width 1s ease-out;
}

@media (min-width: 768px) {
    .season-content {
        flex-direction: row;
        justify-content: space-between;
        text-align: left;
        padding: var(--spacing-3xl);
    }
    
    .season-info {
        flex: 1;
    }
    
    .season-meter-wrapper {
        flex: 1;
        margin: 0 var(--spacing-2xl);
    }
    
    .shop-btn {
        flex-shrink: 0;
    }
}
</style>
