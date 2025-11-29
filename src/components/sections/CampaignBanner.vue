<template>
  <section class="campaign-section">
    <div class="campaign-card festive">
      <div class="campaign-content">
        <span class="campaign-tag">Special Offer</span>
        <h2 class="campaign-title">Holiday Season Sale</h2>
        <p class="campaign-desc">Get flat 20% off on all credit card payments. Limited time offer.</p>
        <LiquidButton text="Claim Offer" type="primary" icon="credit_card" />
      </div>
      <div class="campaign-visual">
         <span class="material-icons-round visual-icon">celebration</span>
      </div>
      <div class="glass-decoration"></div>
    </div>
  </section>
</template>

<script setup>
import LiquidButton from '../liquid-ui-kit/LiquidButton/LiquidButton.vue';
</script>

<style scoped>
.campaign-section {
  padding: var(--spacing-xl) var(--spacing-lg);
  max-width: 1280px;
  margin: 0 auto;
}

.campaign-card {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  box-shadow: var(--liquid-shadow-lg);
  color: white;
}

.campaign-card.festive {
    background: linear-gradient(135deg, #FF9966 0%, #FF5E62 100%);
}

.campaign-content {
  position: relative;
  z-index: 2;
  max-width: 500px;
}

.campaign-tag {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: var(--text-xs);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: var(--spacing-md);
}

.campaign-title {
  font-size: var(--text-3xl);
  font-weight: 900;
  margin-bottom: var(--spacing-sm);
  line-height: 1.2;
}

.campaign-desc {
  font-size: var(--text-lg);
  margin-bottom: var(--spacing-xl);
  opacity: 0.9;
}

.campaign-visual {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.visual-icon {
    font-size: 100px;
    color: rgba(255, 255, 255, 0.8);
}

.glass-decoration {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: 1;
}

@media (max-width: 768px) {
  .campaign-card {
    flex-direction: column;
    text-align: center;
    padding: var(--spacing-xl) var(--spacing-lg);
  }

  .campaign-content {
    margin-bottom: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .campaign-visual {
    width: 120px;
    height: 120px;
  }
  
  .visual-icon {
      font-size: 60px;
  }
}
</style>
