import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import HomePage from './pages/HomePage.vue';
import MapPage from './pages/MapPage.vue';
import LoginPage from './pages/LoginPage.vue';
import { useAdmin } from './composables/useAdmin';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/map',
        name: 'Map',
        component: MapPage
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/onboarding',
        name: 'Onboarding',
        component: () => import('./components/RoleOnboarding.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('./pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/edit',
        name: 'EditProfile',
        component: () => import('./pages/EditProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('./pages/CartPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/wishlist',
        name: 'Wishlist',
        component: () => import('./pages/WishlistPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/onboarding',
        name: 'VendorOnboarding',
        component: () => import('./pages/VendorOnboardingPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/create-store',
        name: 'CreateStore',
        component: () => import('./pages/CreateStorePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/my-stores',
        name: 'MyStores',
        component: () => import('./pages/MyStoresPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/onboarding',
        name: 'StoreOnboarding',
        component: () => import('./pages/StoreOnboardingPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/dashboard',
        name: 'StoreDashboard',
        component: () => import('./pages/StoreDashboardPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/settings',
        name: 'StoreSettings',
        component: () => import('./pages/StoreSettingsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/add-product',
        name: 'AddProduct',
        component: () => import('./pages/AddProductPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/orders',
        name: 'StoreOrders',
        component: () => import('./pages/StoreOrdersPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/orders/:orderId',
        name: 'StoreOrderDetails',
        component: () => import('./pages/StoreOrderDetailsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/marketing',
        name: 'StoreMarketing',
        component: () => import('./pages/StoreMarketingPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/analytics',
        name: 'StoreAnalytics',
        component: () => import('./pages/StoreAnalyticsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/products',
        name: 'StoreProducts',
        component: () => import('./pages/StoreProductsPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/vendor/store/:id/products/:productId/edit',
        name: 'EditProduct',
        component: () => import('./pages/EditProductPage.vue'),
        meta: { requiresAuth: true }
    },
    // Admin Routes
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import('./Admin_Pages/Dashboard/AdminDashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/users',
        name: 'UserManagement',
        component: () => import('./Admin_Pages/Users/UserManagement.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/vendors',
        name: 'VendorManagement',
        component: () => import('./Admin_Pages/Vendors/VendorManagement.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/stores',
        name: 'StoreManagement',
        component: () => import('./Admin_Pages/Stores/StoreManagement.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/team',
        name: 'TeamPage',
        component: () => import('./Admin_Pages/Team/TeamPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/settings',
        name: 'SettingsPage',
        component: () => import('./Admin_Pages/Settings/SettingsPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/kyc',
        name: 'KYCRequests',
        component: () => import('./Admin_Pages/KYC/KYCRequests.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Error',
        component: () => import('./pages/ErrorPage.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    });
};

router.beforeEach(async (to, _from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

    if (requiresAuth) {
        const user = await getCurrentUser();
        if (user) {
            if (requiresAdmin) {
                const { checkAdminStatus, isAdmin } = useAdmin();
                // We need to wait for the check
                await checkAdminStatus();
                if (isAdmin.value) {
                    next();
                } else {
                    // Not admin, redirect to home or error
                    next('/');
                }
            } else {
                next();
            }
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;
