import { ref, watch } from 'vue';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export interface UserProfile {
    uid: string;
    email?: string;
    displayName?: string;
    roles: string[];
    vendorProfile?: {
        storeName: string;
        status: 'pending' | 'active';
    };
    deliveryProfile?: {
        vehicleType: string;
        status: 'pending' | 'active';
    };
    managerProfile?: {
        managedStoreId: string;
        permissions: string[];
        status: 'pending' | 'active';
    };
}

const userProfile = ref<UserProfile | null>(null);
const loadingProfile = ref(false);

export function useUser() {
    const { user } = useAuth();

    const fetchUserProfile = async (uid: string) => {
        loadingProfile.value = true;
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                userProfile.value = userDoc.data() as UserProfile;
            } else {
                // Create default profile
                const newProfile: UserProfile = {
                    uid,
                    email: user.value?.email || '',
                    displayName: user.value?.displayName || '',
                    roles: ['customer']
                };
                await setDoc(userDocRef, newProfile);
                userProfile.value = newProfile;
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        } finally {
            loadingProfile.value = false;
        }
    };

    const addRole = async (role: string, metadata: any = {}) => {
        if (!userProfile.value) return;

        const userDocRef = doc(db, 'users', userProfile.value.uid);
        const updates: any = {
            roles: arrayUnion(role)
        };

        if (role === 'vendor') {
            updates.vendorProfile = { ...metadata, status: 'pending' };
        } else if (role === 'delivery_partner') {
            updates.deliveryProfile = { ...metadata, status: 'pending' };
        } else if (role === 'store_manager') {
            updates.managerProfile = { ...metadata, status: 'pending' };
        }

        await updateDoc(userDocRef, updates);
        await fetchUserProfile(userProfile.value.uid); // Refresh
    };

    // Watch for auth changes to fetch profile
    watch(user, (newUser) => {
        if (newUser) {
            fetchUserProfile(newUser.uid);
        } else {
            userProfile.value = null;
        }
    }, { immediate: true });

    return {
        userProfile,
        loadingProfile,
        addRole
    };
}
