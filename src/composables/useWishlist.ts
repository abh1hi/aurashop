import { ref, watch } from 'vue';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';
import { cacheManager } from '../utils/cacheManager';

const wishlistItems = ref<any[]>([]);
const loading = ref(false);

export function useWishlist() {
    const { user } = useAuth();

    const fetchWishlist = async () => {
        if (!user.value) {
            wishlistItems.value = [];
            return;
        }

        // 1. Try to get cached data
        const cachedWishlist = cacheManager.get(`wishlist_${user.value.uid}`);
        if (cachedWishlist) {
            wishlistItems.value = cachedWishlist;
            // Don't return yet, we need to check for updates in background
            checkForUpdates();
        } else {
            // No cache, fetch immediately
            await loadFromFirestore();
        }
    };

    const checkForUpdates = async () => {
        if (!user.value) return;

        try {
            // Check if there are any changes by fetching metadata or a lightweight query
            // For now, we'll fetch the count or latest item timestamp if possible
            // Simplified: Fetch all and compare length or IDs (in a real app, use a 'lastUpdated' field on user doc)

            const wishlistRef = collection(db, 'users', user.value.uid, 'wishlist');
            const snapshot = await getDocs(wishlistRef);
            const freshData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            if (JSON.stringify(freshData) !== JSON.stringify(wishlistItems.value)) {
                console.log("Wishlist updated from server");
                wishlistItems.value = freshData;
                cacheManager.set(`wishlist_${user.value.uid}`, freshData, 300000); // Update cache
            } else {
                console.log("Wishlist is up to date");
            }
        } catch (error) {
            console.error("Error checking for wishlist updates:", error);
        }
    };

    const loadFromFirestore = async () => {
        if (!user.value) return;
        loading.value = true;
        try {
            const wishlistRef = collection(db, 'users', user.value.uid, 'wishlist');
            const snapshot = await getDocs(wishlistRef);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            wishlistItems.value = data;
            cacheManager.set(`wishlist_${user.value.uid}`, data, 300000); // 5 min TTL
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            loading.value = false;
        }
    };

    const toggleWishlist = async (product: any) => {
        if (!user.value) {
            console.warn("User not logged in");
            return;
        }
        try {
            const productId = product.id.toString();
            const itemRef = doc(db, 'users', user.value.uid, 'wishlist', productId);
            const itemSnap = await getDoc(itemRef);

            if (itemSnap.exists()) {
                await deleteDoc(itemRef);
                wishlistItems.value = wishlistItems.value.filter(i => i.id !== productId);
            } else {
                await setDoc(itemRef, {
                    name: product.name,
                    brand: product.brand || '',
                    price: product.price,
                    image: product.image,
                    addedAt: new Date()
                });
                // Optimistic add
                wishlistItems.value.push({ id: productId, ...product });
            }
            // Update cache immediately after modification
            cacheManager.set(`wishlist_${user.value.uid}`, wishlistItems.value, 300000);

        } catch (error) {
            console.error("Error toggling wishlist:", error);
            await loadFromFirestore(); // Revert/Sync on error
        }
    };

    const isInWishlist = (productId: string | number) => {
        return wishlistItems.value.some(item => item.id === productId.toString());
    };

    // Watch for user changes
    watch(user, (newUser) => {
        if (newUser) {
            fetchWishlist();
        } else {
            wishlistItems.value = [];
        }
    }, { immediate: true });

    return {
        wishlistItems,
        loading,
        fetchWishlist,
        toggleWishlist,
        isInWishlist
    };
}
