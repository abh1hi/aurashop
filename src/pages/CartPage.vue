<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="cart-container">
        <h1 class="page-title">Shopping Bag</h1>
        
        <div v-if="cartItems.length > 0" class="cart-content">
          <div class="cart-items">
            <LiquidCard v-for="item in cartItems" :key="item.id" variant="liquid" class="cart-item-card">
              <div class="cart-item">
                <div class="item-image">
                  <img :src="item.image" :alt="item.name" />
                </div>
                <div class="item-details">
                  <div class="item-header">
                    <h3 class="item-name">{{ item.name }}</h3>
                    <button class="remove-btn" @click="removeItem(item.id)">
                      <span class="material-icons-round">close</span>
                    </button>
                  </div>
                  <p class="item-brand">{{ item.brand }}</p>
                  <div class="item-meta">
                    <span class="item-price">${{ item.price }}</span>
                    <div class="quantity-controls">
                      <button class="qty-btn" @click="decrementQty(item)">-</button>
                      <span class="qty-value">{{ item.quantity }}</span>
                      <button class="qty-btn" @click="incrementQty(item)">+</button>
                    </div>
                  </div>
                </div>
              </div>
            </LiquidCard>
          </div>

          <div class="cart-summary">
            <LiquidCard variant="liquid" class="summary-card">
              <h3 class="summary-title">Order Summary</h3>
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${{ cartTotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>${{ shipping.toFixed(2) }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${{ total.toFixed(2) }}</span>
              </div>
              <LiquidButton 
                text="Checkout" 
                type="primary" 
                size="lg" 
                class="checkout-btn"
                icon="arrow_forward"
                icon-position="right"
                @click="checkout"
              />
            </LiquidCard>
          </div>
        </div>

        <div v-else class="empty-state">
          <span class="material-icons-round empty-icon">shopping_bag</span>
          <h3>Your bag is empty</h3>
          <p>Looks like you haven't added anything yet.</p>
          <LiquidButton 
            text="Start Shopping" 
            type="primary" 
            @click="$router.push('/')"
            class="mt-md"
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
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';

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
      // Optional: confirm removal?
      removeItem(item.id);
  }
};

const removeItem = async (id) => {
  await removeFromCart(id);
  showToast('Item removed from bag', 'info');
};

const checkout = () => {
    showToast('Checkout feature coming soon!', 'info');
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background-color: transparent;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding-top: var(--spacing-lg);
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling: touch;
  display: flex;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}

.cart-container {
  width: 100%;
  max-width: 1000px;
}

.page-title {
  font-size: 24px;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 24px;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .cart-content {
    grid-template-columns: 2fr 1fr;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item-card {
  padding: 16px;
}

.cart-item {
  display: flex;
  gap: 16px;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
}

.item-brand {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 4px 0;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background: rgba(0,0,0,0.05);
  color: var(--danger-color);
}

.remove-btn .material-icons-round {
  font-size: 18px;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.item-price {
  font-weight: 700;
  color: var(--text-color);
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(0,0,0,0.05);
  padding: 4px 8px;
  border-radius: 20px;
}

.qty-btn {
  background: none;
  border: none;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  color: var(--text-color);
}

.qty-value {
  font-size: 14px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.summary-card {
  height: fit-content;
}

.summary-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--text-secondary);
}

.summary-divider {
  height: 1px;
  background: rgba(0,0,0,0.1);
  margin: 16px 0;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 800;
  color: var(--text-color);
  margin-bottom: 24px;
}

.checkout-btn {
  width: 100%;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  color: var(--text-tertiary);
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.mt-md {
  margin-top: 16px;
}
</style>
