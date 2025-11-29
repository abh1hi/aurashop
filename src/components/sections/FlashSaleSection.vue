<template>
  <section class="flash-sale-section">
    <div class="flash-content">
      <div class="flash-header">
        <span class="flash-badge">Limited Time</span>
        <h2 class="flash-title">Flash Sale Ends In</h2>
      </div>
      
      <div class="countdown-timer">
        <div class="timer-block">
          <span class="time">{{ hours }}</span>
          <span class="label">Hours</span>
        </div>
        <span class="separator">:</span>
        <div class="timer-block">
          <span class="time">{{ minutes }}</span>
          <span class="label">Mins</span>
        </div>
        <span class="separator">:</span>
        <div class="timer-block">
          <span class="time">{{ seconds }}</span>
          <span class="label">Secs</span>
        </div>
      </div>
      
      <p class="flash-subtitle">Get up to 70% off on selected items. Don't miss out!</p>
      
      <LiquidButton text="Shop The Sale" type="primary" size="lg" icon="bolt" class="flash-cta" />
    </div>
    
    <div class="flash-image-wrapper">
        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" alt="Flash Sale" class="flash-image" />
        <div class="glass-overlay"></div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import LiquidButton from '../liquid-ui-kit/LiquidButton/LiquidButton.vue';

const hours = ref('02');
const minutes = ref('45');
const seconds = ref('30');
let timer = null;

const startTimer = () => {
    // Simple countdown simulation
    let totalSeconds = 2 * 3600 + 45 * 60 + 30;
    
    timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            return;
        }
        totalSeconds--;
        
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        hours.value = h.toString().padStart(2, '0');
        minutes.value = m.toString().padStart(2, '0');
        seconds.value = s.toString().padStart(2, '0');
    }, 1000);
};

onMounted(() => {
    startTimer();
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});
</script>

<style scoped>
.flash-sale-section {
  position: relative;
  margin: var(--spacing-2xl) auto;
  max-width: 1280px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  background: linear-gradient(135deg, #2c1810 0%, #5d4037 100%);
  color: white;
  box-shadow: var(--liquid-shadow-lg);
}

.flash-content {
  flex: 1;
  padding: var(--spacing-2xl);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  z-index: 2;
}

.flash-badge {
  background: #ff4d4d;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--text-xs);
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: var(--spacing-sm);
  box-shadow: 0 2px 8px rgba(255, 77, 77, 0.4);
}

.flash-title {
  font-size: var(--text-3xl);
  font-weight: 900;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(to right, #fff, #ffccbc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.countdown-timer {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.timer-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 70px;
}

.time {
  font-size: var(--text-2xl);
  font-weight: bold;
  font-family: monospace;
}

.label {
  font-size: var(--text-xs);
  opacity: 0.8;
  text-transform: uppercase;
}

.separator {
  font-size: var(--text-2xl);
  font-weight: bold;
  color: rgba(255, 255, 255, 0.5);
}

.flash-subtitle {
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
  max-width: 400px;
}

.flash-image-wrapper {
  flex: 1;
  position: relative;
  min-height: 300px;
}

.flash-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.glass-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(44, 24, 16, 1) 0%, rgba(44, 24, 16, 0) 100%);
}

@media (max-width: 768px) {
  .flash-sale-section {
    flex-direction: column;
    margin: var(--spacing-lg);
    border-radius: var(--radius-lg);
  }
  
  .flash-image-wrapper {
    height: 200px;
    min-height: auto;
    order: -1;
  }
  
  .glass-overlay {
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(44, 24, 16, 1) 90%);
  }
  
  .flash-content {
    padding: var(--spacing-lg);
    align-items: center;
    text-align: center;
  }
  
  .flash-subtitle {
    font-size: var(--text-base);
  }
}
</style>
