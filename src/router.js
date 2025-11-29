import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import SegmentedControlDemo from './pages/SegmentedControlDemo.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/segmented-control-demo',
    name: 'SegmentedControlDemo',
    component: SegmentedControlDemo,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
