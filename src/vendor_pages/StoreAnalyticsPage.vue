<template>
  <div class="page-container">
    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">arrow_back</span>
        Back to Dashboard
      </div>

      <div class="page-header">
        <h1 class="page-title">Analytics</h1>
        <div class="date-range">
          <span class="material-icons-round">calendar_today</span>
          Last 30 Days
          <span class="material-icons-round">expand_more</span>
        </div>
      </div>

      <!-- Overview Stats -->
      <LiquidStats :stats="analyticsStats" class="mb-xl" />

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Revenue Chart -->
        <div class="chart-card large">
          <div class="chart-header">
            <h3>Revenue Trend</h3>
            <div class="chart-actions">
              <button class="chart-filter active">Week</button>
              <button class="chart-filter">Month</button>
              <button class="chart-filter">Year</button>
            </div>
          </div>
          <div class="chart-container">
            <Line :data="revenueData" :options="lineOptions" />
          </div>
        </div>

        <!-- Traffic Sources -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Traffic Sources</h3>
          </div>
          <div class="chart-container donut">
            <Doughnut :data="trafficData" :options="donutOptions" />
          </div>
        </div>

        <!-- Sales Funnel -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Sales Funnel</h3>
          </div>
          <div class="chart-container">
            <Bar :data="funnelData" :options="barOptions" />
          </div>
        </div>
      </div>

      <!-- Top Products Table -->
      <section class="analytics-section">
        <h2 class="section-title">Top Performing Products</h2>
        <div class="data-table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Views</th>
                <th>Sales</th>
                <th>Revenue</th>
                <th>Conversion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in topProducts" :key="product.id">
                <td class="product-cell">
                  <div class="product-thumb"></div>
                  {{ product.name }}
                </td>
                <td>{{ product.views }}</td>
                <td>{{ product.sales }}</td>
                <td>${{ product.revenue }}</td>
                <td>
                  <span class="conversion-pill" :class="getConversionClass(product.conversion)">
                    {{ product.conversion }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </main>

    <BottomNavBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'vue-chartjs';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidStats from '../components/liquid-ui-kit/LiquidStats/LiquidStats.vue';
import { useAnalytics } from '../composables/useAnalytics';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const router = useRouter();
const route = useRoute();
const { 
  fetchAnalyticsOverview, 
  fetchRevenueTrend, 
  fetchTopProducts, 
  fetchTrafficSources, 
  fetchSalesFunnel 
} = useAnalytics();

const analyticsStats = ref([]);
const topProducts = ref([]);
const revenueData = ref({ labels: [], datasets: [] });
const trafficData = ref({ labels: [], datasets: [] });
const funnelData = ref({ labels: [], datasets: [] });

const getConversionClass = (rate) => {
  if (rate >= 4) return 'high';
  if (rate >= 2) return 'medium';
  return 'low';
};

// Chart Options
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' } }
  }
};

const lineOptions = { ...commonOptions };
const barOptions = { ...commonOptions };
const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  },
  cutout: '70%'
};

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
    // Fetch all data in parallel
    const [stats, revenue, products, traffic, funnel] = await Promise.all([
      fetchAnalyticsOverview(storeId),
      fetchRevenueTrend(storeId),
      fetchTopProducts(storeId),
      fetchTrafficSources(),
      fetchSalesFunnel()
    ]);

    analyticsStats.value = stats;
    revenueData.value = revenue;
    topProducts.value = products;
    trafficData.value = traffic;
    funnelData.value = funnel;
  }
});
</script>

<style scoped src="./StoreAnalyticsPage.css"></style>
