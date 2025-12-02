<template>
  <AdminLayout>
    <div class="dashboard-title-section">
      <div>
        <h1>Dashboard</h1>
        <p>Plan, prioritize, and accomplish your tasks with ease.</p>
      </div>
      <div class="header-actions">
         <LiquidButton text="Add Project" icon="add" type="primary" />
         <LiquidButton text="Import Data" type="secondary" />
      </div>
    </div>

    <div class="stats-grid" v-if="stats">
      <StatCard 
        title="Total Projects" 
        :value="stats.totalUsers" 
        variant="primary"
        trend="5+"
      />
      <StatCard 
        title="Ended Projects" 
        :value="stats.activeVendors" 
        trend="10"
      />
      <StatCard 
        title="Running Projects" 
        :value="stats.pendingKYC" 
        trend="12"
      />
      <StatCard 
        title="Pending Project" 
        value="2" 
        trend="On Discuss"
      />
    </div>

    <div class="dashboard-grid">
      <!-- Left Column -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
         <!-- Placeholder for Project Analytics Chart -->
         <div class="chart-placeholder">
            Project Analytics Chart (Coming Soon)
         </div>
         
         <TeamList />
      </div>

      <!-- Right Column -->
      <div style="display: flex; flex-direction: column; gap: 24px;">
         <!-- Placeholder for Reminders -->
         <div class="chart-placeholder" style="height: 180px; background: white;">
            Reminders Widget
         </div>
         
         <!-- Placeholder for Project Progress -->
         <div class="chart-placeholder" style="height: 240px;">
            Project Progress Donut
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
