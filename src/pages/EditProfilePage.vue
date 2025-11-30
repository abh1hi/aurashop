<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="edit-wrapper">
        <LiquidCard variant="liquid" class="edit-card glass-panel">
          <div class="card-header">
            <div class="header-content">
              <h1 class="title">Edit Profile</h1>
              <p class="subtitle">Update your personal details</p>
            </div>
            <button class="close-btn" @click="router.back()">
              <span class="material-icons-round">close</span>
            </button>
          </div>

          <form @submit.prevent="handleSave" class="edit-form">
            <div class="form-section">
              <h3 class="section-label">Public Info</h3>
              <div class="input-group">
                <LiquidInput 
                  v-model="form.displayName"
                  placeholder="Full Name"
                  icon="person"
                  icon-position="left"
                  label="Display Name"
                  class="modern-input"
                />
                <LiquidInput 
                  v-model="form.username"
                  placeholder="Username"
                  icon="alternate_email"
                  icon-position="left"
                  label="Username"
                  class="modern-input"
                />
              </div>
            </div>

            <div class="form-section">
              <h3 class="section-label">Contact Info</h3>
              <div class="input-group">
                <div class="readonly-field">
                  <label>Email Address</label>
                  <div class="field-value">
                    <span class="material-icons-round icon">email</span>
                    <span>{{ form.email }}</span>
                    <span class="badge">Verified</span>
                  </div>
                </div>
                <LiquidInput 
                  v-model="form.phoneNumber"
                  placeholder="Phone Number"
                  icon="phone"
                  icon-position="left"
                  label="Phone Number"
                  class="modern-input"
                />
              </div>
            </div>

            <div class="form-actions">
              <LiquidButton 
                text="Cancel" 
                type="secondary" 
                class="action-btn"
                @click="router.back()"
              />
              <LiquidButton 
                text="Save Changes" 
                type="primary" 
                class="action-btn"
                :loading="loading"
                @click="handleSave"
              />
            </div>
          </form>
        </LiquidCard>
      </div>
    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
// created-by-llm-agent: reason = "implementing UI rules"; date = 2025-11-30
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import { useEditProfilePage } from './EditProfilePage.js';

const {
    router,
    loading,
    form,
    handleSave
} = useEditProfilePage();
</script>

<style scoped>
@import './EditProfilePage.css';
</style>
