import { ref, computed, watch } from 'vue';
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

const cartItems = ref<any[]>([]);
const loading = ref(false);

export function useCart() {
    const { user } = useAuth();

    const fetchCart = async () => {
        if (!user.value) {
            cartItems.value = [];
            return;
        }
        loading.value = true;
        try {
            const cartRef = collection(db, 'users', user.value.uid, 'cart');
            const snapshot = await getDocs(cartRef);
            cartItems.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            loading.value = false;
        }
    };

    const addToCart = async (product: any) => {
        if (!user.value) {
            // TODO: Handle local cart for guests? For now, just return or prompt login
            console.warn("User not logged in");
            return;
        }
        try {
            const productId = product.id.toString();
            const itemRef = doc(db, 'users', user.value.uid, 'cart', productId);
            const itemSnap = await getDoc(itemRef);

            if (itemSnap.exists()) {
                await updateDoc(itemRef, { quantity: increment(1) });
            } else {
                // Store essential product details
                await setDoc(itemRef, {
                    name: product.name,
                    brand: product.brand || '',
                    price: typeof product.price === 'string' ? parseFloat(product.price.replace('$', '')) : product.price,
                    image: product.image,
                    quantity: 1,
                    variantId: product.variantId || null,
                    selectedOptions: product.selectedOptions || null,
                    addedAt: new Date()
                });
            }
            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    };

    const updateQuantity = async (productId: string, newQuantity: number) => {
        if (!user.value) return;
        if (newQuantity < 1) return;

        try {
            const itemRef = doc(db, 'users', user.value.uid, 'cart', productId);
            await updateDoc(itemRef, { quantity: newQuantity });
            // Optimistic update
            const item = cartItems.value.find(i => i.id === productId);
            if (item) item.quantity = newQuantity;
        } catch (error) {
            console.error("Error updating quantity:", error);
            await fetchCart(); // Revert on error
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!user.value) return;
        try {
            await deleteDoc(doc(db, 'users', user.value.uid, 'cart', productId));
            cartItems.value = cartItems.value.filter(i => i.id !== productId);
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const clearCart = async () => {
        if (!user.value) return;
        // In a real app, maybe call a backend function. Here, delete one by one or batch.
        // For simplicity, we'll just delete one by one for now (not efficient for large carts)
        const promises = cartItems.value.map((item: any) => deleteDoc(doc(db, 'users', user.value!.uid, 'cart', String(item.id))));
        await Promise.all(promises);
        cartItems.value = [];
    };

    const cartTotal = computed(() => {
        return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    });

    const cartCount = computed(() => {
        return cartItems.value.reduce((count, item) => count + item.quantity, 0);
    });

    // Watch for user changes to fetch cart
    watch(user, (newUser) => {
        if (newUser) {
            fetchCart();
        } else {
            cartItems.value = [];
        }
    }, { immediate: true });

    return {
        cartItems,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount
    };
}
