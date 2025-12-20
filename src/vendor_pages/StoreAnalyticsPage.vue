<template>
  <div class="page-container">
    <!-- Background Blobs -->
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <AppHeader />
    
    <main class="main-content">
      <div class="back-link" @click="router.back()">
        <span class="material-icons-round">west</span>
        Dashboard
      </div>

      <div class="page-header">
        <h1 class="page-title">Analytics Engine</h1>
        <div class="header-actions">
          <div class="date-range-pill">
            <span class="material-icons-round">calendar_today</span>
            <span>Last 30 Cycles</span>
            <span class="material-icons-round">expand_more</span>
          </div>
        </div>
      </div>

      <!-- Overview Stats -->
      <LiquidStats :stats="analyticsStats" class="mb-xl" />

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- Revenue Chart -->
        <div class="chart-card large">
          <div class="chart-header">
            <h3>Revenue Projection</h3>
            <div class="chart-actions">
              <button class="chart-filter active">Cycle</button>
              <button class="chart-filter">Phase</button>
              <button class="chart-filter">Epoch</button>
            </div>
          </div>
          <div class="chart-container">
            <Line :data="revenueData" :options="lineOptions" />
          </div>
        </div>

        <!-- Traffic Sources -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Traffic Inflow</h3>
          </div>
          <div class="chart-container donut">
            <Doughnut :data="trafficData" :options="donutOptions" />
          </div>
        </div>

        <!-- Sales Funnel -->
        <div class="chart-card">
          <div class="chart-header">
            <h3>Conversion Pipeline</h3>
          </div>
          <div class="chart-container">
            <Bar :data="funnelData" :options="barOptions" />
          </div>
        </div>
      </div>

      <!-- Top Products Table -->
      <section class="analytics-section">
        <div class="section-header">
          <h2 class="section-title">High-Performance Products</h2>
          <LiquidButton text="Export Report" type="ghost" size="xs" icon="file_download" />
        </div>
        
        <div class="table-viewport">
          <div class="grid-header">
            <span>Product Identity</span>
            <span class="text-center">Exposure</span>
            <span class="text-center">Conversions</span>
            <span class="text-right">Revenue</span>
            <span class="text-right">Efficiency</span>
          </div>

          <div class="grid-rows">
            <div v-for="product in topProducts" :key="product.id" class="data-row">
              <div class="product-col">
                <div class="product-chip">
                  <div class="chip-inner"></div>
                </div>
                <span class="product-name text-truncate">{{ product.name }}</span>
              </div>
              
              <div class="metric-col text-center">
                {{ product.views }}
              </div>
              
              <div class="metric-col text-center">
                {{ product.sales }}
              </div>
              
              <div class="revenue-col text-right">
                <span class="currency">$</span>
                <span class="amount">{{ product.revenue }}</span>
              </div>
              
              <div class="efficiency-col text-right">
                <div class="efficiency-badge" :class="getConversionClass(product.conversion)">
                  {{ product.conversion }}%
                </div>
              </div>
            </div>
          </div>
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
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
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

// Chart Options with matching Liquid aesthetic
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      titleColor: '#1e293b',
      bodyColor: '#1e293b',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${context.parsed.y}`;
        }
      }
    }
  },
  scales: {
    x: { 
      grid: { display: false },
      ticks: { color: '#64748b', font: { size: 10, weight: '600' } }
    },
    y: { 
      grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
      ticks: { color: '#64748b', font: { size: 10, weight: '600' } }
    }
  }
};

const lineOptions = { ...commonOptions };
const barOptions = { ...commonOptions };
const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'bottom',
      labels: {
        color: '#64748b',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: { size: 11, weight: '600' }
      }
    }
  },
  cutout: '75%'
};

onMounted(async () => {
  const storeId = route.params.id;
  if (storeId) {
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
