import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import HomePage from './pages/HomePage.vue';
import MapPage from './pages/MapPage.vue';
import LoginPage from './pages/LoginPage.vue';

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

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await getCurrentUser()) {
            next();
        } else {
            next('/login');
        }
    } else {
        next();
    }
});

export default router;
