import { ref } from 'vue';
import { useAuth } from './useAuth';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, limit, onSnapshot } from 'firebase/firestore';

const isAdmin = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

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

            // Fallback for development/testing if custom claims aren't set up yet
            // In production, strictly rely on claims
            if (!isAdmin.value && import.meta.env.DEV) {
                // Temporary: Check a hardcoded list or a specific field in Firestore for dev
                // For now, let's assume if the email matches a specific one, they are admin (DEV ONLY)
                if (user.value.email === 'admin@aurashop.com') {
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
            // Mocking stats for now as we don't have aggregation queries set up
            // In a real app, you'd use aggregation queries or a dedicated stats document updated via Cloud Functions
            return {
                totalUsers: 1250,
                totalSales: 45000,
                activeVendors: 45,
                pendingKYC: 12
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
            const q = query(usersRef, limit(50)); // Pagination needed in real app
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            // Assuming vendors are users with isVendor: true or a separate collection
            // Based on useVendor, we update 'users' doc. So we query users where isVendor == true
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
            // Query for stores that have explicitly submitted for review
            const q = query(storesRef, where('status', '==', 'pending_review'));
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
                status: 'rejected',
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
        rejectKYC
    };
}
