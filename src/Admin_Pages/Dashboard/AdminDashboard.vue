<template>
  <AdminLayout>
    <div class="dashboard-header">
      <div class="header-intro">
        <h1 class="page-title">Aura<span>Core</span> Command</h1>
        <p class="page-subtitle">Unified administrative oversight and system intelligence.</p>
      </div>
      <div class="header-actions">
        <md-text-button>
          <md-icon slot="icon">assessment</md-icon>
          Reports
        </md-text-button>
        <md-filled-button>
           <md-icon slot="icon">rocket_launch</md-icon>
           Deploy Phase
        </md-filled-button>
      </div>
    </div>

    <!-- M3 Grid Layout -->
    <div class="dashboard-grid">
      <!-- Stats Row -->
      <section class="stats-row">
        <StatCard 
          title="Total Ecosystem Users" 
          :value="stats.totalUsers.toLocaleString()" 
          icon="groups"
          trend-value="+14.2%"
          trend-status="up"
          variant="primary"
        />
        <StatCard 
          title="Active Marketplace Vendors" 
          :value="stats.activeVendors.toString()" 
          icon="storefront"
          trend-value="+3.8%"
          trend-status="up"
        />
        <StatCard 
          title="Pending Verifications" 
          :value="stats.pendingKYC.toString()" 
          icon="verified_user"
          trend-value="-2"
          trend-status="down"
        />
        <StatCard 
          title="Total Protocol Revenue" 
          :value="'$' + (stats.totalSales / 1000).toFixed(1) + 'k'" 
          icon="payments"
          trend-value="+22%"
          trend-status="up"
        />
      </section>

      <!-- Main Content Area -->
      <div class="content-split">
        <!-- Left: Charts & Tables -->
        <div class="main-panel">
          <div class="m3-card chart-card">
            <div class="card-header">
              <div class="header-text">
                  <h3>System Inflow Dynamics</h3>
                  <p>Real-time transaction volume analysis</p>
              </div>
              <div class="segment-control">
                <button class="segment-btn active">Live</button>
                <button class="segment-btn">Week</button>
                <button class="segment-btn">Month</button>
              </div>
            </div>
            <div class="chart-area">
              <!-- Placeholder for Chart -->
              <div class="mock-chart-grid">
                  <div class="bar" style="height: 40%"></div>
                  <div class="bar" style="height: 70%"></div>
                  <div class="bar" style="height: 50%"></div>
                  <div class="bar" style="height: 90%"></div>
                  <div class="bar" style="height: 60%"></div>
                  <div class="bar" style="height: 80%"></div>
                  <div class="bar" style="height: 45%"></div>
                  <div class="bar" style="height: 75%"></div>
              </div>
            </div>
          </div>
          
          <div class="m3-card table-card">
             <div class="card-header">
                <h3>Recent Team Activity</h3>
                <md-text-button>View All</md-text-button>
             </div>
             <TeamList />
          </div>
        </div>

        <!-- Right: Widgets -->
        <div class="side-panel">
          <div class="m3-card widget-card security-widget">
            <div class="widget-header">
                <md-icon>security</md-icon>
                <h3>Security Protocols</h3>
            </div>
            <div class="status-list">
              <div class="status-row">
                <span class="label">KYC Pipeline</span>
                <span class="badge warning">Action Req.</span>
              </div>
              <div class="status-row">
                <span class="label">Auth Gateway</span>
                <span class="badge success">Active</span>
              </div>
              <div class="status-row">
                <span class="label">Fraud Guard</span>
                <span class="badge success">Active</span>
              </div>
            </div>
          </div>

          <div class="m3-card widget-card deployment-widget">
            <div class="widget-header">
                <md-icon>cloud_upload</md-icon>
                <h3>Deployment Status</h3>
            </div>
            <div class="deployment-info">
                 <span class="version">v2.4.0-alpha</span>
                 <div class="progress-bar">
                     <div class="fill" style="width: 74%"></div>
                 </div>
                 <span class="percentage">74% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminLayout from '../components/AdminLayout.vue';
import StatCard from './components/StatCard.vue';
import TeamList from './components/TeamList.vue';
// Icons and components are now imported globally

// Mock Data
const stats = ref({
  totalUsers: 14205,
  activeVendors: 89,
  pendingKYC: 5,
  totalSales: 452900
});
</script>

<style scoped>
/* Dashboard Layout */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -1px;
}

.page-title span {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  color: var(--text-secondary);
  margin-top: 0.5rem;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Grid System */
.dashboard-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.stats-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.5rem;
}

.content-split {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 1.5rem;
}

@media (max-width: 1024px) {
    .content-split {
        grid-template-columns: 1fr;
    }
}

/* M3 Card Styles */
.m3-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    padding: 1.5rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.header-text h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.header-text p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* Segment Control */
.segment-control {
    background: rgba(0, 0, 0, 0.2);
    padding: 4px;
    border-radius: 100px;
    display: flex;
    gap: 4px;
}

.segment-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.segment-btn.active {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* Mock Chart */
.chart-area {
    height: 300px;
    width: 100%;
    position: relative;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}

.mock-chart-grid {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 100%;
    padding-bottom: 1rem;
    gap: 1rem;
}

.bar {
    flex: 1;
    background: linear-gradient(to top, var(--primary-color), rgba(var(--primary-rgb), 0.2));
    border-radius: 4px 4px 0 0;
    opacity: 0.7;
    transition: height 1s ease-out;
}

/* Widgets */
.widget-card {
    margin-bottom: 1.5rem;
}

.widget-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    color: var(--text-secondary);
}

.widget-header h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
}

.status-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: rgba(255,255,255,0.02);
    border-radius: 12px;
}

.badge {
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.badge.warning {
    background: rgba(255, 193, 7, 0.2);
    color: #ffc107;
}

.badge.success {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
}

.deployment-info .version {
    display: block;
    font-family: monospace;
    color: var(--primary-color);
    margin-bottom: 0.75rem;
}

.progress-bar {
    height: 6px;
    background: rgba(255,255,255,0.1);
    border-radius: 100px;
    overflow: hidden;
    margin-bottom: 0.5rem;
}

.progress-bar .fill {
    height: 100%;
    background: var(--primary-color);
    border-radius: 100px;
}

.percentage {
    font-size: 0.875rem;
    color: var(--text-secondary);
}
</style>
