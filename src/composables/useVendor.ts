import { ref } from 'vue';
import { doc, setDoc, updateDoc, collection, addDoc, getDocs, getDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

const loading = ref(false);
const error = ref<string | null>(null);

export function useVendor() {
    const { user } = useAuth();

    const becomeVendor = async () => {
        if (!user.value) return;
        loading.value = true;
        error.value = null;
        try {
            const userRef = doc(db, 'users', user.value.uid);
            await updateDoc(userRef, {
                isVendor: true,
                vendorSince: serverTimestamp()
            });
            // Refresh user profile logic might be needed here if useAuth doesn't auto-update custom claims/fields immediately
            // But since we watch 'user' doc in useUser (if we had one), or if we just rely on local state...
            // For now, assume simple field update is enough.
        } catch (e: any) {
            console.error('Error becoming vendor:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const createStore = async (storeData: { name: string; phone?: string }) => {
        if (!user.value) throw new Error("User not authenticated");
        loading.value = true;
        error.value = null;

        try {
            const storesRef = collection(db, 'stores');
            const newStore = {
                ownerId: user.value.uid,
                name: storeData.name,
                phone: storeData.phone || '',
                createdAt: serverTimestamp(),
                status: 'draft',
                onboardingStep: 1,
                kycStatus: 'pending',
                rating: 0,
                reviewCount: 0
            };

            const docRef = await addDoc(storesRef, newStore);
            return docRef.id;
        } catch (e: any) {
            console.error('Error creating store:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const updateStore = async (storeId: string, data: any) => {
        if (!user.value) return;
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, data);
        } catch (e: any) {
            console.error('Error updating store:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const uploadKYC = async (file: File) => {
        // Mock upload for now as we don't have Storage setup in this context yet
        // In real app: upload to Firebase Storage, get URL
        return new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve(`https://fake-kyc-url.com/${file.name}`);
            }, 1000);
        });
    };

    const submitForReview = async (storeId: string) => {
        if (!user.value) return;
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, {
                status: 'pending_review',
                submittedAt: serverTimestamp()
            });
        } catch (e: any) {
            console.error('Error submitting store:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const getStore = async (storeId: string) => {
        if (!user.value) return null;
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            const snap = await getDoc(storeRef); // Need to import getDoc
            if (snap.exists()) {
                return { id: snap.id, ...snap.data() };
            }
            return null;
        } catch (e: any) {
            console.error('Error fetching store:', e);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const fetchMyStores = async () => {
        if (!user.value) return [];
        loading.value = true;
        try {
            const storesRef = collection(db, 'stores');
            const q = query(storesRef, where('ownerId', '==', user.value.uid));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Error fetching my stores:', e);
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const deleteStore = async (storeId: string) => {
        if (!user.value) return;
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await deleteDoc(storeRef); // Hard delete for now, or soft delete { deleted: true }
        } catch (e: any) {
            console.error('Error deleting store:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const toggleStoreStatus = async (storeId: string, isActive: boolean) => {
        if (!user.value) return;
        loading.value = true;
        try {
            const storeRef = doc(db, 'stores', storeId);
            await updateDoc(storeRef, { isActive });
        } catch (e: any) {
            console.error('Error toggling store status:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        becomeVendor,
        createStore,
        updateStore,
        uploadKYC,
        submitForReview,
        getStore,
        fetchMyStores,
        deleteStore,
        toggleStoreStatus
    };
}
