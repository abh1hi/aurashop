<template>
  <AdminLayout>
    <div class="dashboard-page">
      <!-- M3 Standard Header -->
      <header class="page-header">
        <div class="header-text">
          <h1 class="headline-large">Dashboard</h1>
          <p class="body-large subtext">System overview and performance metrics.</p>
        </div>
        <div class="header-actions">
           <md-filled-button>
             <md-icon slot="icon">add</md-icon>
             New Notification
           </md-filled-button>
        </div>
      </header>

      <!-- Stats Grid -->
      <section class="stats-grid">
        <div class="m3-card stat-card primary-container" @click="router.push('/admin/users')">
          <div class="stat-content">
            <span class="label-medium">Total Users</span>
            <span class="display-small">{{ stats.totalUsers.toLocaleString() }}</span>
            <div class="trend up">
              <md-icon>trending_up</md-icon>
              <span class="label-small">+12.5%</span>
            </div>
          </div>
          <md-icon class="stat-icon">group</md-icon>
        </div>

        <div class="m3-card stat-card" @click="router.push('/admin/vendors')">
          <div class="stat-content">
            <span class="label-medium">Total Vendors</span>
            <span class="display-small">{{ stats.totalVendors }}</span>
            <div class="trend up">
              <md-icon>trending_up</md-icon>
              <span class="label-small">+3.2%</span>
            </div>
          </div>
          <md-icon class="stat-icon">badge</md-icon>
        </div>

        <div class="m3-card stat-card" @click="router.push('/admin/stores')">
          <div class="stat-content">
            <span class="label-medium">Active Stores</span>
            <span class="display-small">{{ stats.activeStores }}</span>
            <div class="trend up">
              <md-icon>storefront</md-icon>
              <span class="label-small">Live</span>
            </div>
          </div>
          <md-icon class="stat-icon">store</md-icon>
        </div>

        <div class="m3-card stat-card" @click="router.push('/admin/kyc')">
          <div class="stat-content">
            <span class="label-medium">Pending Approvals</span>
            <span class="display-small">{{ stats.pendingKYC }}</span>
             <div class="trend down">
              <span class="label-small" style="color: var(--md-sys-color-error);">Action Required</span>
            </div>
          </div>
          <md-icon class="stat-icon">verified_user</md-icon>
        </div>

        <div class="m3-card stat-card">
          <div class="stat-content">
            <span class="label-medium">Total Revenue</span>
            <span class="display-small">${{ (stats.totalSales / 1000).toFixed(1) }}k</span>
            <div class="trend up">
              <md-icon>trending_up</md-icon>
              <span class="label-small">+8.4%</span>
            </div>
          </div>
          <md-icon class="stat-icon">payments</md-icon>
        </div>
      </section>

      <!-- Main Layout -->
      <div class="content-layout">
        <!-- Main Column -->
        <div class="main-column">
          <!-- Chart Section -->
          <section class="m3-card flow-card">
            <div class="card-header">
              <h2 class="title-medium">Transaction Volume</h2>
              <div class="filter-chips">
                <md-chip-set>
                    <md-filter-chip label="7 Days" selected></md-filter-chip>
                    <md-filter-chip label="30 Days"></md-filter-chip>
                </md-chip-set>
              </div>
            </div>
            <div class="chart-container">
               <!-- Simple CSS Bar Chart for Demo (Replace with Chart.js later) -->
               <div class="bar-chart">
                 <div class="bar" style="height: 60%"></div>
                 <div class="bar" style="height: 80%"></div>
                 <div class="bar" style="height: 40%"></div>
                 <div class="bar" style="height: 90%"></div>
                 <div class="bar" style="height: 70%"></div>
                 <div class="bar" style="height: 50%"></div>
                 <div class="bar" style="height: 75%"></div>
               </div>
               <div class="chart-labels">
                 <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
               </div>
            </div>
          </section>

          <!-- Recent Activity -->
           <section class="m3-card table-card">
             <div class="card-header">
                <h2 class="title-medium">Recent Registrations</h2>
                <md-text-button>View All</md-text-button>
             </div>
             <TeamList />
           </section>
        </div>

        <!-- Side Column -->
        <aside class="side-column">
          <!-- System Status -->
          <div class="m3-card widget-card">
            <div class="card-header">
              <h2 class="title-medium">System Health</h2>
              <md-icon>dns</md-icon>
            </div>
            <div class="status-list">
              <div class="status-item">
                <div class="dot" :class="getStatusClass(systemStatus.database)"></div>
                <span>Database</span>
                <span class="status-val">{{ systemStatus.database }}</span>
              </div>
              <div class="status-item">
                <div class="dot" :class="getStatusClass(systemStatus.auth)"></div>
                <span>Authentication</span>
                <span class="status-val">{{ systemStatus.auth }}</span>
              </div>
              <div class="status-item">
                <div class="dot" :class="getStatusClass(systemStatus.storage)"></div>
                <span>Storage</span>
                <span class="status-val">{{ systemStatus.storage }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
           <div class="m3-card widget-card">
            <div class="card-header">
              <h2 class="title-medium">Quick Actions</h2>
            </div>
            <div class="action-list">
              <md-list-item type="button">
                <md-icon slot="start">person_add</md-icon>
                <div slot="headline">Invite Staff</div>
              </md-list-item>
              <md-list-item type="button">
                <md-icon slot="start">settings_backup_restore</md-icon>
                <div slot="headline">System Backup</div>
              </md-list-item>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '../components/AdminLayout.vue';
import TeamList from './components/TeamList.vue';
import { useAdmin } from '../../composables/useAdmin';

const router = useRouter();
const { fetchDashboardStats, fetchChartData } = useAdmin();

const stats = ref({
  totalUsers: 0,
  totalVendors: 0,
  activeStores: 0,
  pendingKYC: 0,
  totalSales: 0
});

const systemStatus = ref({
  database: 'Checking...',
  auth: 'Operational', // Firebase Auth is generally assumed up if we are logged in
  storage: 'Operational'
});

const chartData = ref<number[]>([]);

onMounted(async () => {
    try {
        const data = await fetchDashboardStats();
        if (data) {
            stats.value = data;
            systemStatus.value.database = 'Operational';
        } else {
             systemStatus.value.database = 'Degraded';
        }
    } catch (e) {
        systemStatus.value.database = 'Outage';
    }
    
    // Mock chart data fetch for now, can be replaced by real later
    chartData.value = await fetchChartData();
});

const getStatusClass = (status: string) => {
    if (status === 'Operational') return 'success';
    if (status === 'Degraded') return 'warning';
    if (status === 'Outage' || status === 'Checking...') return 'error'; // Checking might be yellow/warning too, but let's stick to safe defaults or change if needed
    return 'warning';
};
</script>

<style scoped>
/* Typography & Theme Tokens */
.headline-large {
  font-family: var(--md-sys-typescale-headline-large-font);
  font-size: var(--md-sys-typescale-headline-large-size);
  font-weight: var(--md-sys-typescale-headline-large-weight);
  color: var(--md-sys-color-on-background);
  margin: 0;
}

.body-large {
  font-family: var(--md-sys-typescale-body-large-font);
  font-size: var(--md-sys-typescale-body-large-size);
  color: var(--md-sys-color-on-surface-variant);
}

.title-medium {
  font-family: var(--md-sys-typescale-title-medium-font);
  font-size: var(--md-sys-typescale-title-medium-size);
  font-weight: 500;
  color: var(--md-sys-color-on-surface);
  margin: 0;
}

.label-medium {
    font-family: var(--md-sys-typescale-label-medium-font);
    font-size: var(--md-sys-typescale-label-medium-size);
    color: var(--md-sys-color-on-surface-variant);
}

.display-small {
    font-family: var(--md-sys-typescale-display-small-font);
    font-size: var(--md-sys-typescale-display-small-size);
    color: var(--md-sys-color-on-surface);
    font-weight: 400;
}

/* Page Layout */
.dashboard-page {
  /* padding handled by AdminLayout */
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.subtext {
  margin-top: 0.25rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.m3-card {
  background: var(--md-sys-color-surface);
  border-radius: 16px;
  padding: 1.5rem;
  /* Elevation 1 */
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.stat-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.3);
}

.stat-card.primary-container {
    background-color: var(--md-sys-color-secondary-container);
    color: var(--md-sys-color-on-secondary-container);
}

.stat-card.primary-container .label-medium,
.stat-card.primary-container .display-small,
.stat-card.primary-container .stat-icon {
    color: var(--md-sys-color-on-secondary-container);
}

.stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.stat-icon {
  font-size: 48px;
  opacity: 0.2;
  position: absolute;
  right: -10px;
  bottom: -10px;
  transform: rotate(-15deg);
}

.trend {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    font-weight: 500;
}

.trend.up { color: var(--md-sys-color-primary); }
.trend.down { color: var(--md-sys-color-error); }

/* Main Content Layout */
.content-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1024px) {
  .content-layout {
    grid-template-columns: 2fr 1fr;
  }
}

.main-column, .side-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Card Headers */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

/* Chart */
.chart-container {
    height: 250px;
    display: flex;
    flex-direction: column;
}

.bar-chart {
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
    padding-bottom: 8px;
}

.bar {
    width: 32px;
    background: var(--md-sys-color-primary);
    border-radius: 4px 4px 0 0;
    opacity: 0.8;
    transition: height 0.5s ease;
}

.bar:hover {
    opacity: 1;
}

.chart-labels {
    display: flex;
    justify-content: space-around;
    padding-top: 8px;
    color: var(--md-sys-color-on-surface-variant);
    font-size: 0.8rem;
}

/* Status List */
.status-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--md-sys-color-outline-variant);
}

.status-item:last-child {
    border-bottom: none;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: background 0.3s, box-shadow 0.3s;
}

.dot.success { 
    background: #4caf50; 
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.6);
}

.dot.warning { 
    background: #ff9800; 
    box-shadow: 0 0 8px rgba(255, 152, 0, 0.6);
}

.dot.error { 
    background: #f44336; 
    box-shadow: 0 0 8px rgba(244, 67, 54, 0.6);
}

.status-val {
    margin-left: auto;
    font-weight: 500;
    font-size: 0.9rem;
}

/* Action List */
.action-list md-list-item {
    --md-list-item-container-color: transparent;
}
</style>
