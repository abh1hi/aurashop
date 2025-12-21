import { ref, computed, watch, onUnmounted } from 'vue';
import { db } from '../firebase';
import {
    collection,
    query,
    onSnapshot,
    updateDoc,
    doc,
    addDoc,
    serverTimestamp,
    orderBy,
    limit,
    FirestoreError,
    writeBatch,
    Timestamp
} from 'firebase/firestore';
import { useAuth } from './useAuth';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'order' | 'system' | 'promotion';
    link?: string;
    isRead: boolean;
    createdAt?: Timestamp | Date;
}

const notifications = ref<Notification[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Unsubscribe function placeholder
let unsubscribe: (() => void) | null = null;

export function useNotifications() {
    const { user } = useAuth();

    /**
     * Subscribe to the real-time notifications for the current user.
     * Listens to the `users/{userId}/notifications` sub-collection.
     */
    const subscribeToNotifications = () => {
        if (!user.value) return;

        loading.value = true;

        try {
            const userId = user.value!.uid;
            const notifCollection = collection(db, 'users', userId, 'notifications');
            // Query: Get last 50 notifications, ordered by descending creation time
            const q = query(notifCollection, orderBy('createdAt', 'desc'), limit(50));

            unsubscribe = onSnapshot(q, (snapshot) => {
                notifications.value = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Notification[];
                loading.value = false;
            }, (err: FirestoreError) => {
                console.error('Notification Subscribe Error:', err);
                error.value = err.message;
                loading.value = false;
            });

        } catch (e: any) {
            console.error('Error starting subscription:', e);
            error.value = e.message;
            loading.value = false;
        }
    };

    /**
     * Mark a single notification as read.
     */
    const markAsRead = async (id: string) => {
        if (!user.value) return;
        try {
            const notifRef = doc(db, 'users', user.value!.uid, 'notifications', id);
            await updateDoc(notifRef, { isRead: true });
        } catch (e: any) {
            console.error('Failed to mark as read:', e);
        }
    };

    /**
     * Mark all currently loaded notifications as read.
     */
    const markAllAsRead = async () => {
        if (!user.value) return;

        const unread = notifications.value.filter(n => !n.isRead);
        if (unread.length === 0) return;

        try {
            const batch = writeBatch(db);
            unread.forEach(n => {
                const ref = doc(db, 'users', user.value!.uid, 'notifications', n.id);
                batch.update(ref, { isRead: true });
            });
            await batch.commit();
        } catch (e: any) {
            console.error('Failed to mark all as read:', e);
            error.value = e.message;
        }
    };

    /**
     * Send a notification to a specific user.
     * This is CLIENT-SIDE TRIGGERED (Admin Panel).
     * In production this should be done via Cloud Functions.
     */
    const sendNotification = async (
        targetUserId: string,
        payload: {
            title: string;
            message: string;
            type: Notification['type'];
            link?: string;
        }
    ) => {
        try {
            const notifCollection = collection(db, 'users', targetUserId, 'notifications');
            await addDoc(notifCollection, {
                ...payload,
                isRead: false,
                createdAt: serverTimestamp()
            });
        } catch (e: any) {
            console.error('Failed to send notification:', e);
            throw e;
        }
    };

    // Watch for user changes to manage subscription
    watch(user, (newUser) => {
        if (newUser) {
            subscribeToNotifications();
        } else {
            if (unsubscribe) unsubscribe();
            notifications.value = [];
        }
    }, { immediate: true });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    const unreadCount = computed(() => {
        return notifications.value.filter(n => !n.isRead).length;
    });

    return {
        notifications,
        unreadCount,
        loading,
        error,
        subscribeToNotifications,
        markAsRead,
        markAllAsRead,
        sendNotification
    };
}
