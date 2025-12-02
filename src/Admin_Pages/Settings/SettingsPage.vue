<template>
  <AdminLayout>
    <div class="team-page-header">
      <h1>Platform Settings</h1>
      <p>Configure fees, taxes, and general platform options.</p>
    </div>

    <div class="settings-container">
      <div class="settings-section">
        <h2>Financial Configuration</h2>
        
        <div class="form-group">
          <label class="form-label">Platform Fee (%)</label>
          <LiquidInput placeholder="e.g. 10" type="number" v-model="platformFee" />
        </div>
        
        <div class="form-group">
          <label class="form-label">Default Tax Rate (%)</label>
          <LiquidInput placeholder="e.g. 18" type="number" v-model="taxRate" />
        </div>
      </div>

      <div class="settings-section">
        <h2>System Preferences</h2>
        
        <div class="toggle-row">
          <div class="toggle-info">
            <h3>Maintenance Mode</h3>
            <p>Disable access to the platform for all users.</p>
          </div>
          <LiquidToggle v-model="maintenanceMode" />
        </div>

        <div class="toggle-row">
          <div class="toggle-info">
            <h3>Vendor Auto-Approval</h3>
            <p>Automatically approve new vendor registrations.</p>
          </div>
          <LiquidToggle v-model="autoApproveVendors" />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <LiquidButton text="Save Changes" type="primary" icon="save" />
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import LiquidInput from '../../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidToggle from '../../components/liquid-ui-kit/LiquidToggle/LiquidToggle.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';

const platformFee = ref('10');
const taxRate = ref('18');
const maintenanceMode = ref(false);
const autoApproveVendors = ref(false);
</script>

<style scoped src="./SettingsPage.css"></style>
<style scoped src="../Team/TeamPage.css"></style>
