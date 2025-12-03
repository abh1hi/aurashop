<template>
  <section class="section-container coupons-section">
    <div class="section-header">
      <h2 class="section-title">Coupons You May Like</h2>
    </div>
    
    <div class="coupons-scroll">
      <div v-for="coupon in coupons" :key="coupon.code" class="coupon-card glass-panel">
        <div class="coupon-left">
            <span class="discount-amount">{{ coupon.discount }}</span>
            <span class="discount-type">OFF</span>
        </div>
        <div class="coupon-details">
            <span class="coupon-desc">{{ coupon.description }}</span>
            <span class="coupon-min">Min. spend {{ coupon.minSpend }}</span>
        </div>
        <div class="coupon-action">
            <button class="copy-btn" @click="copyCode(coupon.code)">
                {{ copiedCode === coupon.code ? 'COPIED' : 'COPY' }}
            </button>
            <span class="coupon-code">{{ coupon.code }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const copiedCode = ref(null);

const coupons = ref([
    { code: 'SAVE20', discount: '20%', description: 'On all dresses', minSpend: '$50' },
    { code: 'FREESHIP', discount: 'Free', description: 'Shipping', minSpend: '$30' },
    { code: 'NEWUSER', discount: '15%', description: 'First order', minSpend: '$0' },
    { code: 'SUMMER30', discount: '30%', description: 'Summer collection', minSpend: '$100' },
]);

const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    copiedCode.value = code;
    setTimeout(() => {
        copiedCode.value = null;
    }, 2000);
};
</script>

<style scoped>
.section-container {
  padding: var(--spacing-lg);
  width: 100%;
  min-width: 0; /* Critical for flex child with scroll */
}

.section-header {
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-color);
}

.coupons-scroll {
    display: flex;
    gap: var(--spacing-lg);
    overflow-x: auto;
    padding-bottom: var(--spacing-md);
    padding-left: 4px; /* Fix cut-off shadow */
    scrollbar-width: none; /* Firefox */
}

.coupons-scroll::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
}

.coupon-card {
    min-width: 280px;
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    transition: transform 0.2s;
    position: relative;
    overflow: hidden;
}

.coupon-card:hover {
    transform: translateY(-2px);
}

.coupon-card::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-color: var(--bg-color); /* Match page bg to create cutout effect */
    border-radius: 50%;
    box-shadow: inset -2px 0 4px rgba(0,0,0,0.1);
}

.coupon-card::after {
    content: '';
    position: absolute;
    right: -10px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    background-color: var(--bg-color);
    border-radius: 50%;
    box-shadow: inset 2px 0 4px rgba(0,0,0,0.1);
}

.coupon-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: var(--spacing-md);
    border-right: 2px dashed var(--glass-border);
    margin-right: var(--spacing-md);
    min-width: 70px;
}

.discount-amount {
    font-size: var(--text-2xl);
    font-weight: 800;
    color: var(--brand-primary);
}

.discount-type {
    font-size: var(--text-xs);
    font-weight: bold;
    color: var(--text-secondary);
}

.coupon-details {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.coupon-desc {
    font-weight: 600;
    color: var(--text-color);
    font-size: var(--text-sm);
}

.coupon-min {
    font-size: var(--text-xs);
    color: var(--text-secondary);
}

.coupon-action {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.copy-btn {
    background: var(--primary-pastel);
    color: var(--primary-text);
    border: none;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
}

.copy-btn:hover {
    background: var(--primary-hover);
}

.coupon-code {
    font-size: 10px;
    color: var(--text-disabled);
    letter-spacing: 1px;
}
</style>
