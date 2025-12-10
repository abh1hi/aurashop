import { ref } from 'vue';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';


export function useMarketing() {
    // const { user } = useAuth(); // Unused
    const loading = ref(false);
    const error = ref<string | null>(null);

    const fetchCampaigns = async (storeId: string) => {
        loading.value = true;
        try {
            const campaignsRef = collection(db, 'campaigns');
            const q = query(campaignsRef, where('storeId', '==', storeId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Error fetching campaigns:', e);
            error.value = e.message;
            return [];
        } finally {
            loading.value = false;
        }
    };

    const createCampaign = async (storeId: string, campaignData: any) => {
        loading.value = true;
        try {
            const campaignsRef = collection(db, 'campaigns');
            await addDoc(campaignsRef, {
                storeId,
                ...campaignData,
                createdAt: serverTimestamp(),
                status: 'active'
            });
        } catch (e: any) {
            console.error('Error creating campaign:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchCoupons = async (storeId: string) => {
        loading.value = true;
        try {
            const couponsRef = collection(db, 'coupons');
            const q = query(couponsRef, where('storeId', '==', storeId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Error fetching coupons:', e);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const createCoupon = async (storeId: string, couponData: any) => {
        loading.value = true;
        try {
            const couponsRef = collection(db, 'coupons');
            await addDoc(couponsRef, {
                storeId,
                ...couponData,
                createdAt: serverTimestamp(),
                usageCount: 0,
                status: 'active'
            });
        } catch (e: any) {
            console.error('Error creating coupon:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteCoupon = async (couponId: string) => {
        try {
            await deleteDoc(doc(db, 'coupons', couponId));
        } catch (e: any) {
            console.error('Error deleting coupon:', e);
            throw e;
        }
    };

    return {
        loading,
        error,
        fetchCampaigns,
        createCampaign,
        fetchCoupons,
        createCoupon,
        deleteCoupon
    };
}
