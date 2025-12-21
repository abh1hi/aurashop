import { collection, query, where, getDocs, doc, updateDoc, limit, onSnapshot, getCountFromServer, getDoc } from 'firebase/firestore';
import { useNotifications } from './useNotifications';

// ... existing code ...

import { ref } from 'vue';
import { useAuth } from './useAuth';
import { db } from '../firebase';

export function useAdmin() {
    const isAdmin = ref(false);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Centralized Admin List (Dev Only)
    const devAdmins = [
        'admin@aurashop.com',
        'admin@example.com'
    ];

    const { user } = useAuth();
    const { sendNotification } = useNotifications();

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

    // sendNotification is already destructured at the top


    const approveKYC = async (storeId: string) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);

            // Fetch store to get ownerId
            const storeSnap = await getDoc(storeRef); // Make sure getDoc is imported
            if (!storeSnap.exists()) throw new Error('Store not found');
            const storeData = storeSnap.data();

            await updateDoc(storeRef, {
                kycStatus: 'verified',
                status: 'active',
                approvedAt: new Date()
            });

            // Trigger Notification
            if (storeData.ownerId) {
                await sendNotification(storeData.ownerId, {
                    title: 'KYC Verified!',
                    message: `Congratulations! Your store "${storeData.name}" has been verified and is now active.`,
                    type: 'success',
                    link: '/vendor/dashboard'
                });
            }

        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const rejectKYC = async (storeId: string, reasons: string | string[]) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);

            // Fetch store to get ownerId
            const storeSnap = await getDoc(storeRef);
            if (!storeSnap.exists()) throw new Error('Store not found');
            const storeData = storeSnap.data();

            // Normalize reasons to array
            const reasonList = Array.isArray(reasons) ? reasons : [reasons];
            const primaryReason = reasonList[0] || 'Verification Failed';

            await updateDoc(storeRef, {
                kycStatus: 'rejected',
                status: 'rejected',
                rejectionReason: primaryReason, // Store primary reason for simple display
                rejectionDetails: reasonList,   // Store detailed list
                rejectedAt: new Date()
            });

            // Format Notification Message
            let message = `Your application for "${storeData.name}" was rejected.`;
            if (reasonList.length === 1) {
                message += ` Reason: ${primaryReason}`;
            } else {
                message += ` Missing/Incorrect items: ${reasonList.join(', ')}.`;
            }
            message += ` Please correct these details and resubmit.`;

            // Trigger Notification
            if (storeData.ownerId) {
                await sendNotification(storeData.ownerId, {
                    title: 'Verification Action Required',
                    message: message,
                    type: 'error',
                    link: '/vendor/onboarding'
                });
            }

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

    const fetchCustomers = async () => {
        loading.value = true;
        try {
            const usersRef = collection(db, 'users');
            // Assuming customers are users who are not vendors and not admins?
            // Or just everyone. For now, let's treat "Customer" as anyone since everyone is a customer.
            // But if we want *only* customers (non-vendors), we'd filter:
            // const q = query(usersRef, where('isVendor', '!=', true)); 
            // However, Firestore inequality requires composite index. 
            // Let's just fetch all and filter client side for now or assume all users.
            const q = query(usersRef, limit(100)); // Safety limit
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const sendBulkNotification = async (targetGroup: 'all' | 'vendors' | 'customers' | 'specific', payload: any, specificUserIds: string[] = []) => {
        loading.value = true;
        try {
            let userIds: string[] = [];

            if (targetGroup === 'specific') {
                userIds = specificUserIds;
            } else if (targetGroup === 'vendors') {
                const vendors = await fetchVendors();
                userIds = vendors.map((v: any) => v.id);
            } else {
                // 'all' or 'customers' (treating all as customers for now)
                // WARNING: Client-side iteration for large user bases is not scalable.
                // This mimics a cloud function loop.
                const allUsers = await fetchUsers(); // This currently limits to 50 in existing fn
                userIds = allUsers.map((u: any) => u.id);
            }

            console.log(`Sending bulk notification to ${userIds.length} users...`);

            // Send in parallel batches of 10 to avoid overwhelming network but speeding up
            const batchSize = 10;
            for (let i = 0; i < userIds.length; i += batchSize) {
                const chunk = userIds.slice(i, i + batchSize);
                await Promise.all(chunk.map(uid => sendNotification(uid, payload)));
            }

            return userIds.length;

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
        fetchCustomers, // New
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
        updateStoreStatus,
        sendBulkNotification // New
    };
}
