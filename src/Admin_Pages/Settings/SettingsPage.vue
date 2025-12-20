<template>
  <AdminLayout>
    <div class="settings-page-header">
      <div class="header-content">
        <h1 class="page-title">Platform<span>Configuration</span></h1>
        <p class="page-subtitle">Calibrate commercial parameters, security protocols, and system throughput.</p>
      </div>
    </div>

    <div class="settings-viewport">
      <div class="settings-grid">
        <!-- Financial Section -->
        <section class="settings-card">
          <div class="card-header">
            <span class="material-icons-round">account_balance</span>
            <h2>Commercial Engine</h2>
          </div>
          
          <div class="field-cluster">
            <div class="form-field">
              <label class="field-label">Transaction Fee (%)</label>
              <LiquidInput placeholder="10.00" type="number" v-model="platformFee" icon="percent" />
              <p class="field-desc">Global commission applied to all merchant settlements.</p>
            </div>
            
            <div class="form-field">
              <label class="field-label">Fiscal Tax Rate (%)</label>
              <LiquidInput placeholder="18.00" type="number" v-model="taxRate" icon="receipt_long" />
              <p class="field-desc">Standard taxation applied to service invoices.</p>
            </div>
          </div>
        </section>

        <!-- Theme Section -->
        <section class="settings-card full-width">
          <div class="card-header">
            <span class="material-icons-round">palette</span>
            <h2>Visual Identity</h2>
          </div>
          
          <div class="theme-selection-grid">
            <button 
              v-for="theme in themes" 
              :key="theme.id"
              class="theme-swatch"
              :class="{ active: currentTheme === theme.id }"
              @click="setTheme(theme.id)"
              :title="theme.name"
            >
              <div class="swatch-preview" :style="{ background: theme.preview }">
                <div class="swatch-accent" :style="{ background: theme.accent }"></div>
              </div>
              <span class="swatch-label">{{ theme.name }}</span>
              <span v-if="currentTheme === theme.id" class="material-icons-round active-icon">verified</span>
            </button>
          </div>
        </section>

        <!-- Protocol Section -->
        <section class="settings-card">
          <div class="card-header">
            <span class="material-icons-round">terminal</span>
            <h2>System Protocols</h2>
          </div>
          
          <div class="gate-cluster">
            <div class="gate-row">
              <div class="gate-info">
                <h3>Freeze Mode</h3>
                <p>Detach all client nodes and suspend throughput.</p>
              </div>
              <LiquidToggle v-model="maintenanceMode" />
            </div>

            <div class="gate-row">
              <div class="gate-info">
                <h3>Auto-Provisioning</h3>
                <p>Authorize new merchant entities without liveness probes.</p>
              </div>
              <LiquidToggle v-model="autoApproveVendors" />
            </div>
          </div>
        </section>
      </div>

      <footer class="settings-footer">
        <LiquidButton text="Discard Changes" type="ghost" />
        <LiquidButton text="Commit Configuration" type="primary" icon="bolt" />
      </footer>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidToggle from '../../components/liquid-ui-kit/LiquidToggle/LiquidToggle.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import { useTheme } from '../../composables/useTheme';

const { currentTheme, setTheme } = useTheme();

const platformFee = ref('10');
const taxRate = ref('18');
const maintenanceMode = ref(false);
const autoApproveVendors = ref(false);

const themes = [
  { id: 'light', name: 'Default', preview: '#fbfbfd', accent: '#0071e3' },
  { id: 'dark', name: 'Midnight', preview: '#000000', accent: '#0a84ff' },
  { id: 'crystal', name: 'Crystal', preview: 'rgba(255,255,255,0.12)', accent: '#00a8ff' },
  { id: 'frost', name: 'Frost', preview: '#f0f8ff', accent: '#4fc3f7' },
  { id: 'aurora', name: 'Aurora', preview: '#8a2be2', accent: '#00bfa5' },
  { id: 'obsidian', name: 'Obsidian', preview: '#1e1e28', accent: '#bb86fc' },
  { id: 'prism', name: 'Prism', preview: 'linear-gradient(90deg, #ff0080, #0080ff)', accent: '#ff1744' },
  { id: 'cyberpunk', name: 'Cyber', preview: '#050505', accent: '#22d3ee' },
  { id: 'oceanic', name: 'Oceanic', preview: '#f0f8ff', accent: '#007aff' },
  { id: 'sunset', name: 'Sunset', preview: '#fff5f2', accent: '#ff9500' }
];
</script>

<style scoped src="./SettingsPage.css"></style>
