<template>
  <div class="page-container glass-bg-bleed">
    <AppHeader />
    
    <main class="main-content container">
      <div class="cart-wrapper fade-in">
        <header class="page-header-row">
          <h1 class="page-title">Shopping Bag <span class="count-badge">{{ cartItems.length }}</span></h1>
          <p class="page-subtitle">Premium goods selected for your lifestyle.</p>
        </header>
        
        <div v-if="cartItems.length > 0" class="cart-grid-layout">
          <!-- Items List -->
          <div class="cart-items-section">
            <TransitionGroup name="list-slide">
              <LiquidCard 
                v-for="item in cartItems" 
                :key="item.id" 
                variant="liquid" 
                class="cart-item-card-premium"
              >
                <div class="item-inner">
                  <div class="item-visual">
                    <img :src="item.image" :alt="item.name" class="item-img-fluid" />
                  </div>
                  
                  <div class="item-info">
                    <div class="item-primary">
                      <div class="title-wrap">
                        <span class="brand-text">{{ item.brand }}</span>
                        <h3 class="name-text">{{ item.name }}</h3>
                      </div>
                      <span class="price-text">${{ item.price.toFixed(2) }}</span>
                    </div>

                    <div class="item-secondary">
                      <div class="quantity-picker-glass">
                        <button class="qty-control" @click="decrementQty(item)">
                          <span class="material-icons-round">remove</span>
                        </button>
                        <span class="qty-num">{{ item.quantity }}</span>
                        <button class="qty-control" @click="incrementQty(item)">
                          <span class="material-icons-round">add</span>
                        </button>
                      </div>
                      
                      <button class="remove-action" @click="removeItem(item.id)" title="Remove item">
                        <span class="material-icons-round">delete_outline</span>
                        <span class="lbl-mobile">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </LiquidCard>
            </TransitionGroup>
          </div>

          <!-- Summary Column -->
          <aside class="cart-summary-section">
            <LiquidCard variant="liquid" class="summary-card-glass sticky-summary">
              <h2 class="summary-headline">Order Summary</h2>
              
              <div class="summary-details">
                <div class="summary-line">
                  <span>Subtotal</span>
                  <span class="val">${{ cartTotal.toFixed(2) }}</span>
                </div>
                <div class="summary-line">
                  <span>Standard Shipping</span>
                  <span class="val">${{ shipping.toFixed(2) }}</span>
                </div>
                <div class="summary-line bonus">
                  <span>Loyalty Discount</span>
                  <span class="val accent">- $0.00</span>
                </div>
                
                <div class="summary-total-row">
                  <div class="total-lbl"> Total </div>
                  <div class="total-val">${{ total.toFixed(2) }}</div>
                </div>
              </div>

              <div class="summary-actions">
                <LiquidButton 
                  text="Proceed to Checkout" 
                  type="primary" 
                  size="lg" 
                  class="w-100 checkout-btn-liquid"
                  icon="payments"
                  @click="checkout"
                />
                <p class="secure-checkout-note">
                  <span class="material-icons-round">lock</span>
                  Secure, encrypted transactions
                </p>
              </div>
            </LiquidCard>
          </aside>
        </div>

        <div v-else class="empty-state-container">
          <div class="empty-visual">
            <div class="floating-bag">
              <span class="material-icons-round">shopping_bag</span>
            </div>
          </div>
          <h2 class="empty-title">Your Bag is Empty</h2>
          <p class="empty-desc">Discovery awaits. Explore our latest drops and find your next favorite piece.</p>
          <LiquidButton 
            text="Explore Collections" 
            type="primary" 
            size="lg"
            @click="$router.push('/')"
            class="mt-lg"
          />
        </div>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useCart } from '../composables/useCart';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
const { showToast } = useToast();

const shipping = 5.00;

const total = computed(() => {
  return cartTotal.value + shipping;
});

const incrementQty = (item) => {
  updateQuantity(item.id, item.quantity + 1);
};

const decrementQty = (item) => {
  if (item.quantity > 1) {
    updateQuantity(item.id, item.quantity - 1);
  } else {
      removeItem(item.id);
  }
};

const removeItem = async (id) => {
  await removeFromCart(id);
  showToast('Item removed from your bag', 'info');
};

const checkout = () => {
    showToast('Checkout integration coming soon ✨', 'info');
};
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: var(--bg-color);
  position: relative;
}

.glass-bg-bleed::before {
  content: '';
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, color-mix(in srgb, var(--brand-primary) 5%, transparent) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.main-content {
  position: relative;
  z-index: 1;
  padding-top: calc(var(--header-height) + var(--spacing-xl));
  padding-bottom: 120px;
}

.page-header-row {
  margin-bottom: var(--spacing-2xl);
  text-align: left;
}

.page-title {
  font-size: var(--text-3xl);
  font-weight: 900;
  letter-spacing: -0.04em;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--primary-text);
}

.count-badge {
  font-size: var(--text-sm);
  background: var(--brand-primary);
  color: white;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-weight: 700;
}

.page-subtitle {
  color: var(--secondary-text);
  font-size: var(--text-base);
  margin-top: 4px;
}

.cart-grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-2xl);
  align-items: start;
}

@media (min-width: 1024px) {
  .cart-grid-layout {
    grid-template-columns: 1.6fr 1fr;
  }
}

.cart-items-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.cart-item-card-premium {
  padding: 12px !important;
  transition: all 0.3s var(--ease-out);
}

.cart-item-card-premium:hover {
  transform: translateY(-2px);
  box-shadow: var(--liquid-shadow-lg);
}

.item-inner {
  display: flex;
  gap: 20px;
}

.item-visual {
  width: 120px;
  height: 140px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--primary-pastel);
  flex-shrink: 0;
}

.item-img-fluid {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.cart-item-card-premium:hover .item-img-fluid {
  transform: scale(1.05);
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px 0;
}

.item-primary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.brand-text {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--brand-primary);
  font-weight: 700;
  display: block;
  margin-bottom: 2px;
}

.name-text {
  font-size: var(--text-lg);
  font-weight: 800;
  color: var(--primary-text);
  margin: 0;
}

.price-text {
  font-size: var(--text-lg);
  font-weight: 900;
  color: var(--primary-text);
}

.item-secondary {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quantity-picker-glass {
  display: flex;
  align-items: center;
  background: var(--primary-pastel);
  border-radius: var(--radius-full);
  padding: 2px;
  border: 1px solid var(--glass-border);
}

.qty-control {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--primary-text);
  transition: all 0.2s;
}

.qty-control:hover {
  background: white;
  box-shadow: var(--glass-shadow);
}

.qty-num {
  font-weight: 800;
  font-size: var(--text-sm);
  min-width: 36px;
  text-align: center;
}

.remove-action {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-tertiary);
  cursor: pointer;
  font-weight: 600;
  font-size: var(--text-sm);
  transition: all 0.2s;
}

.remove-action:hover {
  color: var(--error-color);
}

.lbl-mobile {
  display: none;
}

/* Summary Card */
.summary-card-glass {
  padding: 32px !important;
}

.sticky-summary {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-xl));
}

.summary-headline {
  font-size: var(--text-xl);
  font-weight: 900;
  margin-bottom: 24px;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  color: var(--secondary-text);
  font-size: var(--text-base);
  font-weight: 500;
}

.summary-line .val {
  color: var(--primary-text);
  font-weight: 700;
}

.summary-line.bonus .val.accent {
  color: var(--success-color);
}

.summary-divider {
  height: 1px;
  background: var(--glass-border);
  margin: 8px 0;
}

.summary-total-row {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 16px;
  border-top: 1px solid var(--glass-border);
}

.total-lbl {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--primary-text);
}

.total-val {
  font-size: var(--text-3xl);
  font-weight: 900;
  color: var(--brand-primary);
  letter-spacing: -0.02em;
}

.summary-actions {
  margin-top: 32px;
}

.checkout-btn-liquid {
  height: 64px !important;
  font-size: 1.1rem !important;
  font-weight: 800 !important;
}

.secure-checkout-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--text-tertiary);
  margin-top: 16px;
  font-weight: 600;
}

/* Empty State */
.empty-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  background: var(--liquid-glass-base);
  border-radius: var(--radius-2xl);
  border: 1px solid var(--glass-border);
}

.empty-visual {
  width: 120px;
  height: 120px;
  background: color-mix(in srgb, var(--brand-primary) 5%, transparent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
}

.floating-bag {
  animation: float-soft 4s ease-in-out infinite;
  color: var(--brand-primary);
}

.floating-bag .material-icons-round {
  font-size: 56px;
}

@keyframes float-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  font-size: var(--text-2xl);
  font-weight: 900;
  margin-bottom: 12px;
}

.empty-desc {
  max-width: 320px;
  color: var(--secondary-text);
  line-height: 1.6;
}

/* Transitions */
.list-slide-enter-active,
.list-slide-leave-active {
  transition: all 0.4s ease;
}
.list-slide-enter-from { opacity: 0; transform: translateX(-30px); }
.list-slide-leave-to { opacity: 0; transform: scale(0.95); }

@media (max-width: 640px) {
  .item-inner {
    flex-direction: column;
    gap: 16px;
  }
  
  .item-visual {
    width: 100%;
    height: 180px;
  }
  
  .lbl-mobile {
    display: inline;
  }
}
</style>
