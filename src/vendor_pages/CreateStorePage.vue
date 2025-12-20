<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="form-container">
        <LiquidCard class="store-form-card" variant="liquid">
          <h1 class="form-title">Create Your Store</h1>
          <p class="form-subtitle">Tell us about your business</p>

          <form @submit.prevent="handleSubmit" class="store-form">
            <div class="form-group">
              <label>Store Name</label>
              <LiquidInput 
                v-model="formData.name" 
                placeholder="e.g. Urban Threads" 
                required 
                class="glass-input"
              />
            </div>

            <div class="form-group">
              <label>Description</label>
              <LiquidInput 
                v-model="formData.description" 
                placeholder="What do you sell?" 
                required 
                class="glass-input"
              />
            </div>

            <div class="form-group">
              <label>Category</label>
              <LiquidDropdown 
                :options="categories"
                v-model="formData.category"
                placeholder="Select Category"
                class="glass-input"
              />
            </div>

            <div class="form-group">
              <label>Logo URL (Optional)</label>
              <LiquidInput 
                v-model="formData.logoUrl" 
                placeholder="https://..." 
                class="glass-input"
              />
            </div>

            <div class="form-actions">
              <LiquidButton 
                text="Create Store" 
                type="primary" 
                size="lg" 
                :loading="loading"
                submit
                class="w-full"
              />
            </div>
            
            <p v-if="error" class="error-text">{{ error }}</p>
          </form>
        </LiquidCard>
      </div>
    </main>
    
    <BottomNavBar />
  </div>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import { useCreateStorePage } from './CreateStorePage';

const {
    formData,
    categories,
    loading,
    error,
    handleSubmit
} = useCreateStorePage();
</script>

<style scoped>
@import './CreateStorePage.css';
</style>
