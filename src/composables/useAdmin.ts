import { ref } from 'vue';
import { useAuth } from './useAuth';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, limit, onSnapshot, getCountFromServer, arrayUnion, arrayRemove } from 'firebase/firestore';

const isAdmin = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

// Centralized Admin List (Dev Only)
const devAdmins = [
    'admin@aurashop.com',
    'admin@example.com'
];

export function useAdmin() {
    const { user } = useAuth();

    const checkAdminStatus = async () => {
        if (!user.value) {
            isAdmin.value = false;
            return;
        }

        try {
            const idTokenResult = await user.value.getIdTokenResult();
            isAdmin.value = !!idTokenResult.claims.admin;

            // Fallback for development/testing
            if (!isAdmin.value && import.meta.env.DEV) {
                if (user.value.email && devAdmins.includes(user.value.email)) {
                    isAdmin.value = true;
                }
            }
        } catch (e) {
            console.error('Error checking admin status:', e);
            isAdmin.value = false;
        }
    };

    const fetchDashboardStats = async () => {
        loading.value = true;
        try {
            const usersColl = collection(db, 'users');
            const storesColl = collection(db, 'stores');

            // Parallel Aggregation
            const [usersSnap, activeStoresSnap, pendingKYCSnap] = await Promise.all([
                getCountFromServer(usersColl),
                getCountFromServer(query(storesColl, where('status', '==', 'active'))),
                getCountFromServer(query(storesColl, where('kycStatus', '==', 'pending_review')))
            ]);

            return {
                totalUsers: usersSnap.data().count,
                totalSales: 45000, // Revenue calculation needs separate aggregation logic or dedicated stats doc
                activeVendors: activeStoresSnap.data().count,
                pendingKYC: pendingKYCSnap.data().count
            };
        } catch (e: any) {
            error.value = e.message;
            return null;
        } finally {
            loading.value = false;
        }
    };

    const fetchUsers = async () => {
        loading.value = true;
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, limit(50));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => {
                const data = doc.data();
                const isDevAdmin = import.meta.env.DEV && data.email && devAdmins.includes(data.email);

                return {
                    id: doc.id,
                    ...data,
                    isAdmin: data.isAdmin || isDevAdmin
                };
            });
        } catch (e: any) {
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const toggleUserBan = async (userId: string, isBanned: boolean) => {
        loading.value = true;
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, { isBanned });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchVendors = async () => {
        loading.value = true;
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('isVendor', '==', true));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const subscribeToStores = (callback: (stores: any[]) => void) => {
        const storesRef = collection(db, 'stores');
        return onSnapshot(storesRef, (snapshot) => {
            const stores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(stores);
        });
    };

    const fetchStores = async () => {
        loading.value = true;
        try {
            const storesRef = collection(db, 'stores');
            const snapshot = await getDocs(storesRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const toggleStoreStatus = async (storeId: string, isActive: boolean) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, { isActive });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };
    const fetchPendingKYCRequests = async () => {
        loading.value = true;
        try {
            const storesRef = collection(db, 'stores');
            const q = query(storesRef, where('kycStatus', '==', 'pending_review'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const approveKYC = async (storeId: string) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, {
                kycStatus: 'verified',
                status: 'active',
                approvedAt: new Date()
            });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const rejectKYC = async (storeId: string, reason: string) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, {
                kycStatus: 'rejected',
                status: 'rejected', // Or 'suspended' depending on business logic
                rejectionReason: reason,
                rejectedAt: new Date()
            });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateUserRole = async (userId: string, newRole: 'admin' | 'vendor' | 'customer') => {
        loading.value = true;
        try {
            const userRef = doc(db, 'users', userId);

            // Map simple role selection to database booleans
            const updates: any = {
                isAdmin: newRole === 'admin',
                isVendor: newRole === 'vendor'
            };

            await updateDoc(userRef, updates);
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateStoreCommission = async (storeId: string, rate: number) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, { commissionRate: rate });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const toggleStoreVisibility = async (storeId: string, isVisible: boolean) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, { isVisible });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateStoreStatus = async (storeId: string, status: 'active' | 'suspended' | 'under_review') => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, { status, isActive: status === 'active' });
        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    return {
        isAdmin,
        loading,
        error,
        checkAdminStatus,
        fetchDashboardStats,
        fetchUsers,
        toggleUserBan,
        fetchVendors,
        subscribeToStores,
        fetchStores,
        toggleStoreStatus,
        fetchPendingKYCRequests,
        approveKYC,
        rejectKYC,
        updateUserRole,
        updateStoreCommission,
        toggleStoreVisibility,
        updateStoreStatus
    };
}
