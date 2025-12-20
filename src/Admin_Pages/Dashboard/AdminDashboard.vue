<template>
  <AdminLayout>
    <div class="dashboard-header">
      <div class="header-intro">
        <h1 class="page-title">Aura<span>Core</span> Command</h1>
        <p class="page-subtitle">Unified administrative oversight and system intelligence.</p>
      </div>
      <div class="header-actions">
        <LiquidButton text="Reports" icon="assessment" type="ghost" size="sm" />
        <LiquidButton text="Deploy Phase" icon="rocket_launch" type="primary" size="sm" />
      </div>
    </div>

    <div class="stats-overview" v-if="stats">
      <StatCard 
        title="Total Ecosystem Users" 
        :value="stats.totalUsers" 
        icon="groups"
        trend-value="+14.2%"
        trend-status="up"
        variant="primary"
      />
      <StatCard 
        title="Active Marketplace Vendors" 
        :value="stats.activeVendors" 
        icon="storefront"
        trend-value="+3.8%"
        trend-status="up"
      />
      <StatCard 
        title="Pending Security Verifications" 
        :value="stats.pendingKYC" 
        icon="verified_user"
        trend-value="-2"
        trend-status="down"
      />
      <StatCard 
        title="Total Revenue Protocol" 
        :value="'$' + (stats.totalSales / 1000).toFixed(1) + 'k'" 
        icon="payments"
        trend-value="+22%"
        trend-status="up"
      />
    </div>

    <div class="dashboard-content">
      <div class="main-column">
        <div class="glass-card chart-hero">
          <div class="card-header">
            <h3 class="card-title">System Inflow Dynamics</h3>
            <div class="card-controls">
              <button class="control-btn active">Live</button>
              <button class="control-btn">Cycle</button>
            </div>
          </div>
          <div class="chart-viewport">
            <!-- Integration Point for Chart.js -->
            <div class="chart-skeleton"></div>
          </div>
        </div>
        
        <TeamList />
      </div>

      <div class="side-column">
        <div class="glass-card status-widget">
          <h3 class="card-title">Security Protocols</h3>
          <div class="status-list">
            <div class="status-item">
              <span class="status-label">KYC Pipeline</span>
              <span class="status-value active">Optimization Req.</span>
            </div>
            <div class="status-item">
              <span class="status-label">Auth Gateway</span>
              <span class="status-value success">Operational</span>
            </div>
          </div>
        </div>

        <div class="glass-card progress-widget">
          <h3 class="card-title">deployment_v2_alpha</h3>
          <div class="progress-ring-wrap">
            <div class="ring-core">74%</div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdmin } from '../../composables/useAdmin';
import AdminLayout from '../components/AdminLayout.vue';
import StatCard from './components/StatCard.vue';
import TeamList from './components/TeamList.vue';
import LiquidButton from '../../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';

const { fetchDashboardStats } = useAdmin();
const stats = ref<any>(null);

onMounted(async () => {
  stats.value = await fetchDashboardStats();
});
</script>

<style scoped src="./AdminDashboard.css"></style>
