<template>
  <div class="page-container">
    <!-- Background Elements -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      <div class="onboarding-wrapper">
        <!-- Hero Section -->
        <header class="hero-header">
          <div class="badge">
            <span class="material-icons-round" style="font-size: 16px;">verified_user</span>
            Official Vendor Program
          </div>
          <h1 class="title">Scale Your Business with <span class="gradient-text">AuraShop</span></h1>
          <p class="subtitle">Join a premium marketplace designed for growth. Start selling to millions of customers with our enterprise-grade ecosystem.</p>
        </header>

        <!-- Features Section -->
        <div class="features-grid">
          <LiquidCard class="feature-card" variant="liquid">
            <div class="icon-wrapper">
              <span class="material-icons-round feature-icon">storefront</span>
            </div>
            <h3>Modern Storefront</h3>
            <p>A beautiful, lightning-fast digital storefront tailored to showcase your unique brand identity and products.</p>
          </LiquidCard>
          
          <LiquidCard class="feature-card" variant="liquid">
            <div class="icon-wrapper">
              <span class="material-icons-round feature-icon">auto_graph</span>
            </div>
            <h3>Growth Tools</h3>
            <p>Access advanced analytics, AI-driven insights, and marketing tools designed to help you scale efficiently.</p>
          </LiquidCard>
          
          <LiquidCard class="feature-card" variant="liquid">
            <div class="icon-wrapper">
              <span class="material-icons-round feature-icon">security</span>
            </div>
            <h3>Enterprise Security</h3>
            <p>Built-in protection for your data and transactions, ensuring a secure environment for you and your clients.</p>
          </LiquidCard>
        </div>

        <!-- Call to Action -->
        <section class="cta-section">
          <LiquidCard variant="liquid" class="cta-inner">
            <div class="cta-content">
              <h2>Ready to start your journey?</h2>
              <p>Setup takes less than 5 minutes. No upfront costs, just zero-friction growth for your business.</p>
              <div class="action-buttons">
                <LiquidButton 
                  text="Become a Vendor" 
                  type="primary" 
                  size="lg" 
                  icon="rocket_launch"
                  :loading="loading"
                  @click="handleStartSelling"
                />
              </div>
              <Transition name="fade">
                <p v-if="error" class="error-text">
                  <span class="material-icons-round">error_outline</span>
                  {{ error }}
                </p>
              </Transition>
            </div>
          </LiquidCard>
        </section>

        <!-- Trust Indicators -->
        <footer class="trust-footer">
          <p>Trusted by 10,000+ premium brands</p>
          <div class="brand-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </footer>
      </div>
    </main>
    
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidCard from '../components/liquid-ui-kit/LiquidCard/LiquidCard.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useVendorOnboardingLogic } from './VendorOnboardingPage';

const { loading, error, handleStartSelling } = useVendorOnboardingLogic();
</script>

<style scoped src="./VendorOnboardingPage.css"></style>
