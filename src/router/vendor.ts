import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { getCurrentUser } from './guard';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/vendor',
        redirect: '/vendor/my-stores'
    },
    {
        path: '/vendor/',
        redirect: '/vendor/my-stores'
    },
    {
        path: '/vendor/onboarding',
        name: 'VendorOnboarding',
        component: () => import('../vendor_pages/VendorOnboardingPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/create-store',
        name: 'CreateStore',
        component: () => import('../vendor_pages/CreateStorePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/my-stores',
        name: 'MyStores',
        component: () => import('../vendor_pages/MyStoresPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/onboarding',
        name: 'StoreOnboarding',
        component: () => import('../vendor_pages/StoreOnboardingPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/dashboard',
        name: 'StoreDashboard',
        component: () => import('../vendor_pages/StoreDashboardPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/settings',
        name: 'StoreSettings',
        component: () => import('../vendor_pages/StoreSettingsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/add-product',
        name: 'AddProduct',
        component: () => import('../vendor_pages/AddProductPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/orders',
        name: 'StoreOrders',
        component: () => import('../vendor_pages/StoreOrdersPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/orders/:orderId',
        name: 'StoreOrderDetails',
        component: () => import('../vendor_pages/StoreOrderDetailsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/marketing',
        name: 'StoreMarketing',
        component: () => import('../vendor_pages/StoreMarketingPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/analytics',
        name: 'StoreAnalytics',
        component: () => import('../vendor_pages/StoreAnalyticsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/products',
        name: 'StoreProducts',
        component: () => import('../vendor_pages/StoreProductsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/products/:productId/edit',
        name: 'EditProduct',
        component: () => import('../vendor_pages/EditProductPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'VendorError',
        component: () => import('../pages/ErrorPage.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, _from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth) {
        const user = await getCurrentUser();
        if (user) {
            next();
        } else {
            window.location.href = '/login';
        }
    } else {
        next();
    }
});

export default router;
