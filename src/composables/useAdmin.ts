import { collection, query, where, getDocs, doc, updateDoc, limit, onSnapshot, getCountFromServer, getDoc, runTransaction, serverTimestamp, arrayUnion, orderBy, addDoc, documentId, deleteDoc } from 'firebase/firestore';
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
            const ordersColl = collection(db, 'orders'); // Ensure this collection exists or fallback handle

            // Parallel Aggregation
            const [usersSnap, vendorsSnap, activeStoresSnap, pendingKYCSnap] = await Promise.all([
                getCountFromServer(usersColl),
                getCountFromServer(query(collection(db, 'users'), where('isVendor', '==', true))),
                getCountFromServer(query(storesColl, where('status', '==', 'active'))),
                getCountFromServer(query(storesColl, where('kycStatus', 'in', ['pending', 'pending_review', 'submitted'])))
            ]);

            // Revenue: Approximating by summing last 100 orders to avoid full DB read
            // In Production: Should use a cloud function to aggregate stats/revenue doc
            let totalRevenue = 0;
            try {
                const revenueQuery = query(ordersColl, limit(100)); // Sort by date desc if possible
                const revenueSnap = await getDocs(revenueQuery);
                totalRevenue = revenueSnap.docs.reduce((acc, doc) => acc + (doc.data().total || 0), 0);
            } catch (revErr) {
                console.warn('Revenue fetch failed, defaulting to 0:', revErr);
            }

            return {
                totalUsers: usersSnap.data().count,
                totalVendors: vendorsSnap.data().count,
                activeStores: activeStoresSnap.data().count,
                totalSales: totalRevenue,
                pendingKYC: pendingKYCSnap.data().count
            };
        } catch (e: any) {
            console.error('Stats fetch error:', e);
            error.value = e.message;
            return {
                totalUsers: 0,
                totalVendors: 0,
                activeStores: 0,
                totalSales: 0,
                pendingKYC: 0
            };
        } finally {
            loading.value = false;
        }
    };

    const fetchChartData = async (period = '7d') => {
        // Mocking real chart data since we don't have aggregation queries yet
        // In real app: Use grouping query or aggregated stats doc
        return [65, 59, 80, 81, 56, 55, 40].map(v => v * Math.random() * 10);
    };

    const fetchRecentActivity = async () => {
        loading.value = true;
        try {
            const usersRef = collection(db, 'users');
            // Try sorting by createdAt, if index missing it might fail, catch will handle it
            // Safe fallback: just Limit 5 (arbitrary recent-ish)
            let q;
            try {
                q = query(usersRef, orderBy('createdAt', 'desc'), limit(5));
            } catch {
                q = query(usersRef, limit(5));
            }
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                name: doc.data().displayName || doc.data().name || 'Anonymous',
                role: doc.data().role || 'User',
                avatar: doc.data().photoURL || `https://ui-avatars.com/api/?name=${doc.data().displayName || 'User'}`,
                status: 'completed', // simplified status
                statusLabel: 'Active'
            }));
        } catch (e: any) {
            console.error('Activity fetch error:', e);
            return [];
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
            const q = query(storesRef, where('kycStatus', 'in', ['pending', 'pending_review', 'submitted']));
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


    const approveKYC = async (storeId: string, customMessage?: string) => {
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);

            // Fetch store to get ownerId
            const storeSnap = await getDoc(storeRef);
            if (!storeSnap.exists()) throw new Error('Store not found');
            const storeData = storeSnap.data();

            await updateDoc(storeRef, {
                kycStatus: 'verified',
                status: 'active',
                approvedAt: new Date()
            });

            // Trigger Notification
            if (storeData.ownerId) {
                const defaultMsg = `Congratulations! Your store "${storeData.name}" has been verified and is now active.`;
                await sendNotification(storeData.ownerId, {
                    title: 'KYC Verified!',
                    message: customMessage || defaultMsg,
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

    const rejectKYC = async (storeId: string, reasons: string | string[], customMessage?: string) => {
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
            let message = '';
            if (customMessage) {
                message = customMessage;
            } else {
                message = `Your application for "${storeData.name}" was rejected.`;
                if (reasonList.length === 1) {
                    message += ` Reason: ${primaryReason}`;
                } else {
                    message += ` Missing/Incorrect items: ${reasonList.join(', ')}.`;
                }
                message += ` Please correct these details and resubmit.`;
            }

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

            // ---------------------------------------------------------
            // Log to Global History
            // ---------------------------------------------------------
            try {
                const logsRef = collection(db, 'admin_notification_logs');
                await addDoc(logsRef, {
                    ...payload,
                    targetGroup,
                    recipientCount: userIds.length,
                    sentBy: user.value?.email || 'system',
                    sentAt: serverTimestamp()
                });
            } catch (logErr) {
                console.error('Failed to save notification log:', logErr);
            }

            return userIds.length;

        } catch (e: any) {
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchNotificationLogs = async (filters?: { email?: string; date?: string }) => {
        loading.value = true;
        try {
            const logsRef = collection(db, 'admin_notification_logs');
            let constraints: any[] = [orderBy('sentAt', 'desc'), limit(50)];

            if (filters) {
                if (filters.email && filters.email.trim() !== '') {
                    // Note: This requires a composite index [sentBy ASC, sentAt DESC]
                    constraints = [
                        where('sentBy', '==', filters.email.trim()),
                        orderBy('sentAt', 'desc'),
                        limit(50)
                    ];
                }

                if (filters.date) {
                    const startOfDay = new Date(filters.date);
                    startOfDay.setHours(0, 0, 0, 0);

                    const endOfDay = new Date(filters.date);
                    endOfDay.setHours(23, 59, 59, 999);

                    // Date filter dominates the ordering usually
                    // If we have email AND date, we need composite index [sentBy, sentAt]
                    if (filters.email && filters.email.trim() !== '') {
                        constraints = [
                            where('sentBy', '==', filters.email.trim()),
                            where('sentAt', '>=', startOfDay),
                            where('sentAt', '<=', endOfDay),
                            orderBy('sentAt', 'desc')
                        ];
                    } else {
                        constraints = [
                            where('sentAt', '>=', startOfDay),
                            where('sentAt', '<=', endOfDay),
                            orderBy('sentAt', 'desc')
                        ];
                    }
                }
            }

            const q = query(logsRef, ...constraints);
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Fetch logs error:', e);
            error.value = e.message; // Expose error for potential index link
            return [];
        } finally {
            loading.value = false;
        }
    };





    const fetchPendingStaffApprovals = async (storeId: string) => {
        loading.value = true;
        try {
            const invitesRef = collection(db, 'store_invites');
            const q = query(invitesRef, where('storeId', '==', storeId), where('status', '==', 'pending_admin'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const finalizeStaffApproval = async (inviteId: string) => {
        loading.value = true;
        try {
            await runTransaction(db, async (transaction) => {
                // 1. Get Invite
                const inviteRef = doc(db, 'store_invites', inviteId);
                const inviteSnap = await transaction.get(inviteRef);

                if (!inviteSnap.exists()) throw new Error("Invite not found");
                const inviteData: any = inviteSnap.data();

                if (inviteData.status !== 'pending_admin') throw new Error("Invite status invalid");

                // 2. Add to Staff Subcollection
                const staffRef = doc(db, 'stores', inviteData.storeId, 'staff', inviteData.applicantUid);
                transaction.set(staffRef, {
                    uid: inviteData.applicantUid,
                    email: inviteData.applicantData.email,
                    name: inviteData.applicantData.name,
                    role: inviteData.role,
                    addedAt: serverTimestamp(),
                    addedBy: 'system_admin', // Or current admin ID
                    inviteId: inviteId
                });

                // 3. Update Invite Status
                transaction.update(inviteRef, {
                    status: 'approved',
                    adminApprovedAt: serverTimestamp()
                });

                // 4. Update User Roles (Privileged Action - Admin Only)
                const userRef = doc(db, 'users', inviteData.applicantUid);
                transaction.update(userRef, {
                    roles: arrayUnion('staff', 'vendor')
                });

                // 5. Notify Applicant
                const notificationRef = doc(collection(db, 'users', inviteData.applicantUid, 'notifications'));
                transaction.set(notificationRef, {
                    title: 'Welcome to the Team!',
                    message: `You have been officially approved as a staff member for ${inviteData.storeName || 'the store'}. You can now access the vendor dashboard.`,
                    type: 'success',
                    read: false,
                    createdAt: serverTimestamp(),
                    link: `/vendor/store/${inviteData.storeId}/dashboard`
                });
            });
        } catch (e: any) {
            console.error('Error finalizing approval:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchUserDetails = async (uid: string) => {
        loading.value = true;
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) return null;
            const userData = userSnap.data();

            // Parallel Fetch Subcollections
            const wishlistRef = collection(db, 'users', uid, 'wishlist');
            const trackingRef = collection(db, 'users', uid, 'tracking_sessions');
            const cartRef = collection(db, 'users', uid, 'cart'); // Assuming subcollection, fallback if empty

            const [wishlistSnap, trackingSnap, cartSnap] = await Promise.all([
                getDocs(wishlistRef),
                getDocs(trackingRef),
                getDocs(cartRef)
            ]);

            const result = {
                id: uid,
                ...userData,
                wishlist: wishlistSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                trackingSessions: trackingSnap.docs.map(d => ({ id: d.id, ...d.data() })),
                cart: cartSnap.docs.map(d => ({ id: d.id, ...d.data() }))
            };

            console.log('fetchUserDetails success:', result);
            return result;
        } catch (e: any) {
            console.error('fetchUserDetails error:', e);
            error.value = e.message;
            return null;
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
        fetchCustomers,
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
        sendBulkNotification,
        fetchPendingStaffApprovals,
        finalizeStaffApproval,
        fetchUserDetails,
        fetchChartData,
        fetchRecentActivity,
        fetchNotificationLogs,
        searchUsers: async (params: { query?: string; role?: string; isBanned?: boolean | null }) => {
            loading.value = true;
            try {
                const usersRef = collection(db, 'users');

                // Base Constraints
                const baseConstraints: any[] = [limit(50)];
                if (params.role) {
                    if (params.role === 'admin') baseConstraints.push(where('isAdmin', '==', true));
                    else if (params.role === 'vendor') baseConstraints.push(where('isVendor', '==', true));
                }
                if (params.isBanned !== undefined && params.isBanned !== null) {
                    baseConstraints.push(where('isBanned', '==', params.isBanned));
                }

                if (params.query) {
                    const qText = params.query.trim();

                    // 1. Email Search (Exact)
                    if (qText.includes('@')) {
                        const q = query(usersRef, ...baseConstraints, where('email', '==', qText));
                        const snaps = await getDocs(q);
                        return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
                    }

                    // 2. ID Search (Exact)
                    if (qText.length > 20 && !qText.includes(' ')) {
                        const q = query(usersRef, ...baseConstraints, where(documentId(), '==', qText));
                        const snaps = await getDocs(q);
                        return snaps.docs.map(d => ({ id: d.id, ...d.data() }));
                    }

                    // 3. Name Search (Dual Query: Exact + TitleCase)
                    // This simulates case-insensitivity for standard names (e.g. "john" finds "john" and "John")
                    const match1 = qText;
                    const match2 = qText.charAt(0).toUpperCase() + qText.slice(1);

                    const queries = [
                        query(usersRef, ...baseConstraints, where('displayName', '>=', match1), where('displayName', '<=', match1 + '\uf8ff')),
                    ];

                    if (match1 !== match2) {
                        queries.push(query(usersRef, ...baseConstraints, where('displayName', '>=', match2), where('displayName', '<=', match2 + '\uf8ff')));
                    }

                    const snapshots = await Promise.all(queries.map(q => getDocs(q)));

                    // Deduplicate results
                    const resultMap = new Map();
                    snapshots.forEach(snap => {
                        snap.docs.forEach(doc => {
                            resultMap.set(doc.id, { id: doc.id, ...doc.data() });
                        });
                    });

                    return Array.from(resultMap.values());
                }

                // No Query - Just Filters
                const q = query(usersRef, ...baseConstraints);
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            } catch (e: any) {
                console.error('Search users error:', e);
                error.value = e.message;
                return [];
            } finally {
                loading.value = false;
            }
        },

        searchStores: async (params: { query?: string; status?: string; kycStatus?: string }) => {
            loading.value = true;
            try {
                const storesRef = collection(db, 'stores');
                const baseConstraints: any[] = [limit(50)];

                if (params.status && params.status !== 'all') {
                    baseConstraints.push(where('status', '==', params.status));
                }
                if (params.kycStatus && params.kycStatus !== 'all') {
                    baseConstraints.push(where('kycStatus', '==', params.kycStatus));
                }

                if (params.query) {
                    const qText = params.query.trim();

                    // 1. ID Search
                    if (qText.length > 20 && !qText.includes(' ')) {
                        const q = query(storesRef, ...baseConstraints, where(documentId(), '==', qText));
                        const snap = await getDocs(q);
                        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
                    }

                    // 2. Name Search (Dual Query: Exact + TitleCase)
                    const match1 = qText;
                    const match2 = qText.charAt(0).toUpperCase() + qText.slice(1);

                    const queries = [
                        query(storesRef, ...baseConstraints, where('name', '>=', match1), where('name', '<=', match1 + '\uf8ff')),
                    ];

                    if (match1 !== match2) {
                        queries.push(query(storesRef, ...baseConstraints, where('name', '>=', match2), where('name', '<=', match2 + '\uf8ff')));
                    }

                    const snapshots = await Promise.all(queries.map(q => getDocs(q)));

                    const resultMap = new Map();
                    snapshots.forEach(snap => {
                        snap.docs.forEach(doc => {
                            resultMap.set(doc.id, { id: doc.id, ...doc.data() });
                        });
                    });

                    return Array.from(resultMap.values());
                }

                const q = query(storesRef, ...baseConstraints);
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            } catch (e: any) {
                console.error('Search stores error:', e);
                error.value = e.message;
                return [];
            } finally {
                loading.value = false;
            }
        },

        saveDraft: async (draft: any) => {
            loading.value = true;
            try {
                const draftsRef = collection(db, 'admin_notification_drafts');
                await addDoc(draftsRef, {
                    ...draft,
                    updatedAt: serverTimestamp(),
                    createdBy: user.value?.email || 'system'
                });
            } catch (e: any) {
                console.error('Save draft error:', e);
                error.value = e.message;
                throw e;
            } finally {
                loading.value = false;
            }
        },

        fetchDrafts: async (filters?: { email?: string; date?: string }) => {
            loading.value = true;
            try {
                const draftsRef = collection(db, 'admin_notification_drafts');
                let constraints: any[] = [orderBy('updatedAt', 'desc')];

                if (filters) {
                    if (filters.email && filters.email.trim() !== '') {
                        constraints = [
                            where('createdBy', '==', filters.email.trim()),
                            orderBy('updatedAt', 'desc')
                        ];
                    }

                    if (filters.date) {
                        const startOfDay = new Date(filters.date);
                        startOfDay.setHours(0, 0, 0, 0);

                        const endOfDay = new Date(filters.date);
                        endOfDay.setHours(23, 59, 59, 999);

                        if (filters.email && filters.email.trim() !== '') {
                            constraints = [
                                where('createdBy', '==', filters.email.trim()),
                                where('updatedAt', '>=', startOfDay),
                                where('updatedAt', '<=', endOfDay),
                                orderBy('updatedAt', 'desc')
                            ];
                        } else {
                            constraints = [
                                where('updatedAt', '>=', startOfDay),
                                where('updatedAt', '<=', endOfDay),
                                orderBy('updatedAt', 'desc')
                            ];
                        }
                    }
                }

                const q = query(draftsRef, ...constraints);
                const snapshot = await getDocs(q);
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (e: any) {
                console.error('Fetch drafts error:', e);
                return [];
            } finally {
                loading.value = false;
            }
        },

        globalSearch: async (queryStr: string) => {
            if (!queryStr || queryStr.length < 2) return { pages: [], users: [], stores: [] };

            loading.value = true;
            try {
                const results = {
                    pages: [] as any[],
                    users: [] as any[],
                    stores: [] as any[]
                };

                // 1. Static Pages Search
                const adminRoutes = [
                    { title: 'Dashboard', path: '/admin', icon: 'dashboard' },
                    { title: 'User Management', path: '/admin/users', icon: 'group' },
                    { title: 'Vendor Management', path: '/admin/vendors', icon: 'store' },
                    { title: 'Store Management', path: '/admin/stores', icon: 'storefront' },
                    { title: 'Notifications', path: '/admin/notifications', icon: 'notifications' },
                    { title: 'Settings', path: '/admin/settings', icon: 'settings' },
                    { title: 'Team', path: '/admin/team', icon: 'people' },
                    { title: 'Messages', path: '/admin/messages', icon: 'chat' },
                    { title: 'KYC Requests', path: '/admin/kyc', icon: 'verified_user' }
                ];

                results.pages = adminRoutes.filter(r =>
                    r.title.toLowerCase().includes(queryStr.toLowerCase())
                );

                // 2. Dynamic Search (Parallel)
                // We reuse existing search functions but need to handle their `loading` state slightly differently
                // since we are manually managing `loading` here.
                // We'll just call the implementation logic directly or use the exposed functions.
                // Using exposed functions might trigger main `loading` ref, which is fine.

                // However, `searchUsers` and `searchStores` are available in this scope?
                // No, they are inside the return object. We need to define them before or use internal refs if refactoring.
                // Since I am appending this to the end of the return object, I cannot easily call the sibling functions.
                // I will duplicate the logic slightly or rely on the `globalSearch` being composed outside?
                // Better approach: Implement `globalSearch` using direct logic since we are inside `useAdmin`.

                // Wait, `searchUsers` logic is huge. I should not duplicate it. 
                // The `useAdmin` function returns an object. I can't call `this.searchUsers`.
                // I will define `searchUsersInternal` inside `useAdmin` body if I want to reuse, 
                // OR I will just perform a basic search here for efficiency (Global search might need lighter queries).

                // Let's do a basic name/email search for Global Search context.

                const qLower = queryStr.toLowerCase();
                const usersRef = collection(db, 'users');
                const storesRef = collection(db, 'stores');

                const match1 = qLower;
                const match2 = qLower.charAt(0).toUpperCase() + qLower.slice(1);

                const [userEmailSnaps, userNameSnaps, storeSnaps] = await Promise.all([
                    // Users: Email prefix
                    getDocs(query(usersRef, where('email', '>=', match1), where('email', '<=', match1 + '\uf8ff'), limit(5))),
                    // Users: Name prefix (Title Case usually)
                    getDocs(query(usersRef, where('displayName', '>=', match2), where('displayName', '<=', match2 + '\uf8ff'), limit(5))),
                    // Stores: Name prefix
                    getDocs(query(storesRef, where('name', '>=', match2), where('name', '<=', match2 + '\uf8ff'), limit(5)))
                ]);

                // Merge and deduplicate users
                const userMap = new Map();
                userEmailSnaps.docs.forEach(d => userMap.set(d.id, { id: d.id, ...d.data(), type: 'user' }));
                userNameSnaps.docs.forEach(d => userMap.set(d.id, { id: d.id, ...d.data(), type: 'user' }));

                results.users = Array.from(userMap.values());
                results.stores = storeSnaps.docs.map(d => ({ id: d.id, ...d.data(), type: 'store' }));

                return results;

            } catch (e: any) {
                console.error('Global search error:', e);
                return { pages: [], users: [], stores: [] };
            } finally {
                loading.value = false;
            }
        },

        deleteDraft: async (draftId: string) => {
            loading.value = true;
            try {
                await deleteDoc(doc(db, 'admin_notification_drafts', draftId));
            } catch (e: any) {
                console.error('Delete draft error:', e);
                error.value = e.message;
                throw e;
            } finally {
                loading.value = false;
            }
        }
    };
}
