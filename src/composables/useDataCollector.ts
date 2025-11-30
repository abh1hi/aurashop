import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { doc, setDoc, updateDoc, arrayUnion, serverTimestamp, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { useTheme } from './useTheme';
import { useLocation } from './useLocation';
import { useCart } from './useCart';
import { useWishlist } from './useWishlist';
import { getDeviceInfo } from '../utils/deviceFingerprint';
import { v4 as uuidv4 } from 'uuid';

export function useDataCollector() {
    const { user } = useAuth();
    const { currentTheme, liquidAnimationsEnabled } = useTheme();
    const { location } = useLocation();
    const { cartItems, cartTotal } = useCart();
    const { wishlistItems } = useWishlist();
    const route = useRoute();
    const router = useRouter();

    const sessionId = ref(localStorage.getItem('tracking_session_id') || uuidv4());
    const startTime = Date.now();
    const pageVisits = ref<any[]>([]);

    // Initialize Session
    const initSession = async () => {
        if (!user.value) return;

        localStorage.setItem('tracking_session_id', sessionId.value);
        const deviceInfo = getDeviceInfo();

        const sessionRef = doc(db, 'users', user.value.uid, 'tracking_sessions', sessionId.value);

        const initialData = {
            sessionId: sessionId.value,
            startTime: serverTimestamp(),
            lastActive: serverTimestamp(),
            device: deviceInfo,
            location: {
                // These might be null initially if useLocation hasn't finished
                address: location.value || 'Unknown',
                ip: 'Captured by Server', // Client-side IP capture is tricky without external service
            },
            preferences: {
                theme: currentTheme.value,
                animationsEnabled: liquidAnimationsEnabled.value,
                language: navigator.language,
                currency: 'USD', // Default
            },
            ecommerce: {
                cartItemCount: cartItems.value.length,
                cartTotal: cartTotal.value,
                wishlistCount: wishlistItems.value.length,
                checkoutStep: 0,
                abandonedCart: cartItems.value.length > 0, // Initial assumption
                paymentMethod: null, // To be captured during checkout
                coupons: []
            },
            metadata: {
                referrer: document.referrer,
                userAgent: navigator.userAgent,
            }
        };

        try {
            await setDoc(sessionRef, initialData, { merge: true });
            console.log('[DataCollector] Session initialized:', sessionId.value);
        } catch (e) {
            console.error('[DataCollector] Failed to init session', e);
        }
    };

    // Track Page Views & Category Interests
    const trackPageView = async (to: any) => {
        if (!user.value) return;

        const visit = {
            path: to.path,
            name: to.name,
            timestamp: Date.now(),
            referrer: document.referrer
        };

        pageVisits.value.push(visit);

        const sessionRef = doc(db, 'users', user.value.uid, 'tracking_sessions', sessionId.value);

        // Infer Interest from Route
        let interest = null;
        if (to.path.includes('/category/')) {
            interest = to.params.name || to.path.split('/').pop();
        }

        try {
            const updateData: any = {
                activity_log: arrayUnion(visit),
                lastActive: serverTimestamp(),
                'browsing.lastVisited': to.path,
                'browsing.pagesVisited': pageVisits.value.length
            };

            if (interest) {
                updateData['ecommerce.interests'] = arrayUnion(interest);
            }

            await updateDoc(sessionRef, updateData);
        } catch (e) {
            // If document doesn't exist (e.g. cleared), re-init might be needed, or just ignore
            console.warn('[DataCollector] Failed to log page view', e);
        }
    };

    // Track Custom Events (e.g. Checkout Steps)
    const trackEvent = async (eventName: string, eventData: any = {}) => {
        if (!user.value) return;
        const sessionRef = doc(db, 'users', user.value.uid, 'tracking_sessions', sessionId.value);

        try {
            await updateDoc(sessionRef, {
                events: arrayUnion({ name: eventName, data: eventData, timestamp: Date.now() }),
                lastActive: serverTimestamp()
            });
        } catch (e) {
            console.error('[DataCollector] Failed to track event', e);
        }
    };

    // Watchers
    watch(user, (newUser) => {
        if (newUser) {
            initSession();
        }
    }, { immediate: true });

    watch(() => route.path, (newPath) => {
        if (newPath && user.value) {
            trackPageView(route);
        }
    });

    // Track Preferences Changes
    watch([currentTheme, liquidAnimationsEnabled], async ([newTheme, newAnim]) => {
        if (!user.value) return;
        const sessionRef = doc(db, 'users', user.value.uid, 'tracking_sessions', sessionId.value);
        try {
            await updateDoc(sessionRef, {
                'preferences.theme': newTheme,
                'preferences.animationsEnabled': newAnim,
                lastActive: serverTimestamp()
            });
        } catch (e) {
            console.error('[DataCollector] Failed to update prefs', e);
        }
    });

    // Track Cart & Wishlist Changes
    watch([cartItems, wishlistItems], async ([newCart, newWishlist]) => {
        if (!user.value) return;
        const sessionRef = doc(db, 'users', user.value.uid, 'tracking_sessions', sessionId.value);
        try {
            await updateDoc(sessionRef, {
                'ecommerce.cartItemCount': newCart.length,
                'ecommerce.cartTotal': cartTotal.value,
                'ecommerce.wishlistCount': newWishlist.length,
                'ecommerce.abandonedCart': newCart.length > 0,
                lastActive: serverTimestamp()
            });
        } catch (e) {
            // Ignore errors if session doc not ready
        }
    }, { deep: true });

    return {
        sessionId,
        trackEvent
    };
}
