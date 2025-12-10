<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">arrow_back</span>
        Back to Dashboard
      </div>

      <div class="page-header">
        <h1 class="page-title">Products</h1>
        <LiquidButton 
          text="Add Product" 
          icon="add" 
          type="primary" 
          @click="router.push(`/vendor/store/${route.params.id}/add-product`)"
        />
      </div>

      <div class="products-container">
        <div v-if="loading" class="loading-state">
          <LiquidSpinner />
        </div>
        
        <div v-else-if="products.length === 0" class="empty-state">
          <span class="material-icons-round">inventory_2</span>
          <h3>No products yet</h3>
          <p>Start building your catalog by adding your first product.</p>
          <LiquidButton 
            text="Add Product" 
            type="primary" 
            class="mt-md"
            @click="router.push(`/vendor/store/${route.params.id}/add-product`)"
          />
        </div>

        <div v-else class="products-grid">
          <div v-for="product in products" :key="product.id" class="product-card">
            <div class="product-image">
              <img v-if="product.images && product.images.length" :src="product.images[0]" :alt="product.name" />
              <div v-else class="placeholder">
                <span class="material-icons-round">image</span>
              </div>
              <div class="product-status" :class="product.status">{{ product.status }}</div>
            </div>
            
            <div class="product-details">
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-meta">
                <span class="price">${{ product.price }}</span>
                <span class="stock">Stock: {{ product.stock }}</span>
              </div>
            </div>

            <div class="product-actions">
              <button class="action-btn edit" @click="editProduct(product.id)">
                <span class="material-icons-round">edit</span>
                Edit
              </button>
              <button class="action-btn delete" @click="handleDelete(product.id)">
                <span class="material-icons-round">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidSpinner from '../components/liquid-ui-kit/LiquidSpinner/LiquidSpinner.vue';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

const router = useRouter();
const route = useRoute();
const { fetchProducts, deleteProduct } = useVendor();
const { showToast } = useToast();

const products = ref([]);
const loading = ref(true);

const loadProducts = async () => {
  loading.value = true;
  const storeId = route.params.id;
  if (storeId) {
    products.value = await fetchProducts(storeId);
  }
  loading.value = false;
};

const editProduct = (productId) => {
  router.push(`/vendor/store/${route.params.id}/products/${productId}/edit`);
};

const handleDelete = async (productId) => {
  if (confirm('Are you sure you want to delete this product? This cannot be undone.')) {
    try {
      await deleteProduct(productId);
      products.value = products.value.filter(p => p.id !== productId);
      showToast('Product deleted', 'success');
    } catch (e) {
      showToast('Failed to delete product', 'error');
    }
  }
};

onMounted(loadProducts);
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  background-image: var(--gradient-mesh);
  background-attachment: fixed;
  background-size: cover;
}

.main-content {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  margin-bottom: 24px;
  font-weight: 600;
  width: fit-content;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-color);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(var(--glass-blur));
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.product-image {
  height: 200px;
  background: #f3f4f6;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  color: #d1d5db;
}

.placeholder .material-icons-round {
  font-size: 48px;
}

.product-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(255,255,255,0.9);
  color: var(--text-color);
  text-transform: uppercase;
}

.product-status.active { color: var(--success-color); }
.product-status.draft { color: var(--warning-color); }

.product-details {
  padding: 16px;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.price {
  font-weight: 600;
  color: var(--primary-color);
}

.product-actions {
  padding: 12px 16px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.action-btn.edit {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.action-btn.edit:hover {
  background: rgba(59, 130, 246, 0.2);
}

.action-btn.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  flex: 0 0 40px;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  text-align: center;
  color: var(--text-secondary);
}

.empty-state .material-icons-round {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}
</style>
