import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import MapPage from '../pages/MapPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import { getCurrentUser } from './guard';

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
        path: '/product/:id',
        name: 'ProductDetails',
        component: () => import('../pages/ProductDetailsPage.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/onboarding',
        name: 'Onboarding',
        component: () => import('../components/RoleOnboarding.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../pages/ProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/profile/edit',
        name: 'EditProfile',
        component: () => import('../pages/EditProfilePage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../pages/CartPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/wishlist',
        name: 'Wishlist',
        component: () => import('../pages/WishlistPage.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Error',
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
            next('/login');
        }
    } else {
        next();
    }
});

export default router;
