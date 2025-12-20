<template>
  <div class="page-container">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">west</span>
        Back to Dashboard
      </div>

      <header class="page-header">
        <h1 class="page-title">Product Catalog</h1>
        <LiquidButton 
          text="Add Product" 
          icon="add" 
          type="primary" 
          size="sm"
          @click="router.push(`/vendor/store/${route.params.id}/add-product`)"
        />
      </header>

      <div class="products-container">
        <div v-if="loading" class="loading-state">
          <LiquidSpinner />
        </div>
        
        <div v-else-if="products.length === 0" class="empty-state">
          <span class="material-icons-round">inventory_2</span>
          <h3>Empty Catalog</h3>
          <p>Start building your inventory by adding your first product.</p>
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
              <div class="product-status" :class="`status-${product.status || 'draft'}`">
                {{ (product.status || 'draft').replace('_', ' ') }}
              </div>
            </div>
            
            <div class="product-details">
              <h3 class="product-name" :title="product.name">{{ product.name }}</h3>
              <div class="product-meta">
                <span class="price">${{ product.price?.toFixed(2) }}</span>
                <span class="stock">Units: {{ product.stock || 0 }}</span>
              </div>
            </div>

            <div class="product-actions">
              <button class="action-btn edit" @click="editProduct(product.id)">
                <span class="material-icons-round">edit_note</span>
                Edit
              </button>
              <button class="action-btn delete" @click="handleDelete(product.id)" title="Delete Product">
                <span class="material-icons-round">delete_outline</span>
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
    try {
      products.value = await fetchProducts(storeId);
    } catch (e) {
      console.error("Failed to load products", e);
      showToast('Catalog load error', 'error');
    }
  }
  loading.value = false;
};

const editProduct = (productId) => {
  router.push(`/vendor/store/${route.params.id}/products/${productId}/edit`);
};

const handleDelete = async (productId) => {
  if (confirm('Delete this product? This action is irreversible.')) {
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

<style scoped src="./StoreProductsPage.css"></style>
