import { ref, watch } from 'vue';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export interface Address {
    id: string;
    label: string; // e.g., Home, Office
    addressLine: string;
    phoneNumber: string;
}

export interface UserProfile {
    uid: string;
    email?: string;
    displayName?: string;
    phoneNumber?: string;
    username?: string;
    photoURL?: string;
    addresses?: Address[];
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
                    phoneNumber: user.value?.phoneNumber || '',
                    roles: ['customer'],
                    addresses: []
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

    const updateProfile = async (data: Partial<UserProfile>) => {
        if (!userProfile.value) return;
        try {
            const userDocRef = doc(db, 'users', userProfile.value.uid);
            await updateDoc(userDocRef, data);
            // Optimistic update
            userProfile.value = { ...userProfile.value, ...data };
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };

    const addAddress = async (address: Omit<Address, 'id'>) => {
        if (!userProfile.value) return;
        try {
            const newAddress = { ...address, id: Date.now().toString() };
            const userDocRef = doc(db, 'users', userProfile.value.uid);
            await updateDoc(userDocRef, {
                addresses: arrayUnion(newAddress)
            });
            // Refresh or optimistic update
            if (!userProfile.value.addresses) userProfile.value.addresses = [];
            userProfile.value.addresses.push(newAddress);
        } catch (error) {
            console.error("Error adding address:", error);
            throw error;
        }
    };

    const removeAddress = async (addressId: string) => {
        if (!userProfile.value || !userProfile.value.addresses) return;
        try {
            const addressToRemove = userProfile.value.addresses.find(a => a.id === addressId);
            if (!addressToRemove) return;

            const userDocRef = doc(db, 'users', userProfile.value.uid);
            // arrayRemove requires the exact object. If we only have ID, we might need to read-modify-write or ensure we have the object.
            // Since we have the local state, we can find it.
            // However, Firestore arrayRemove checks for equality of all fields.
            // A safer way for complex arrays is to read, filter, and write back the array.

            const newAddresses = userProfile.value.addresses.filter(a => a.id !== addressId);
            await updateDoc(userDocRef, { addresses: newAddresses });

            userProfile.value.addresses = newAddresses;
        } catch (error) {
            console.error("Error removing address:", error);
            throw error;
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
        updateProfile,
        addAddress,
        removeAddress,
        addRole
    };
}
