import { ref, watch } from 'vue';
import { collection, doc, getDocs, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

const wishlistItems = ref<any[]>([]);
const loading = ref(false);

export function useWishlist() {
    const { user } = useAuth();

    const fetchWishlist = async () => {
        if (!user.value) {
            wishlistItems.value = [];
            return;
        }
        loading.value = true;
        try {
            const wishlistRef = collection(db, 'users', user.value.uid, 'wishlist');
            const snapshot = await getDocs(wishlistRef);
            wishlistItems.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            await fetchWishlist(); // Revert on error
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
