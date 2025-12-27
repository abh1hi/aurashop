import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAdmin } from '../composables/useAdmin';
import { getCurrentUser } from './guard';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/admin',
        name: 'AdminDashboard',
        component: () => import('../Admin_Pages/Dashboard/AdminDashboard.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/users',
        name: 'UserManagement',
        component: () => import('../Admin_Pages/Users/UserManagement.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/users/search',
        name: 'UserSearch',
        component: () => import('../Admin_Pages/Users/UserSearch.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/users/:id',
        name: 'UserDetailPage',
        component: () => import('../Admin_Pages/Users/UserDetailPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/vendors',
        name: 'VendorManagement',
        component: () => import('../Admin_Pages/Vendors/VendorManagement.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/stores',
        name: 'StoreManagement',
        component: () => import('../Admin_Pages/Stores/StoreManagement.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/stores/search',
        name: 'StoreSearch',
        component: () => import('../Admin_Pages/Stores/StoreSearch.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/stores/:id',
        name: 'StoreDetail',
        component: () => import('../Admin_Pages/Stores/StoreDetailPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/stores/:id/activity',
        name: 'StoreActivity',
        component: () => import('../Admin_Pages/Stores/StoreActivityPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/team',
        name: 'TeamPage',
        component: () => import('../Admin_Pages/Team/TeamPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/settings',
        name: 'SettingsPage',
        component: () => import('../Admin_Pages/Settings/SettingsPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/kyc',
        name: 'KYCRequests',
        component: () => import('../Admin_Pages/KYC/KYCRequests.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/notifications',
        name: 'NotificationCenter',
        component: () => import('../Admin_Pages/Notifications/NotificationCenter.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/notifications/history',
        name: 'NotificationHistory',
        component: () => import('../Admin_Pages/Notifications/NotificationHistory.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/messages',
        name: 'MessagesPage',
        component: () => import('../Admin_Pages/Messages/MessagesPage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/not-authorized',
        name: 'NotAuthorized',
        component: () => import('../Admin_Pages/NotAuthorized.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'AdminError',
        component: () => import('../pages/ErrorPage.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async (to, _from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);

    if (to.name === 'NotAuthorized') {
        next();
        return;
    }

    if (requiresAuth) {
        const user = await getCurrentUser();
        if (user) {
            if (requiresAdmin) {
                const { checkAdminStatus, isAdmin } = useAdmin();
                await checkAdminStatus();
                if (isAdmin.value) {
                    next();
                } else {
                    next('/admin/not-authorized');
                }
            } else {
                next();
            }
        } else {
            // Redirect to main login, but we are in admin app.
            // A hard redirect might be better to clear state or ensure we are on the main domain if needed.
            // But window.location.href works fine.
            window.location.href = '/login';
        }
    } else {
        next();
    }
});

export default router;
