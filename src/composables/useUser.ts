import { ref, watch } from 'vue';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './useAuth';

export interface Address {
    id: string;
    label: string; // e.g., Home, Office
    addressLine: string;
    houseNumber?: string;
    street?: string;
    city: string;
    pincode: string;
    country: string;
    phoneNumber: string;
    lat: number;
    lng: number;
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
    createdAt?: any;
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
                    addresses: [],
                    createdAt: user.value?.metadata?.creationTime || new Date().toISOString()
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

    const updateAddress = async (updatedAddress: Address) => {
        if (!userProfile.value || !userProfile.value.addresses) return;
        try {
            const newAddresses = userProfile.value.addresses.map(a =>
                a.id === updatedAddress.id ? updatedAddress : a
            );

            const userDocRef = doc(db, 'users', userProfile.value.uid);
            await updateDoc(userDocRef, { addresses: newAddresses });

            userProfile.value.addresses = newAddresses;
        } catch (error) {
            console.error("Error updating address:", error);
            throw error;
        }
    };

    const removeAddress = async (addressId: string) => {
        if (!userProfile.value || !userProfile.value.addresses) return;
        try {
            const newAddresses = userProfile.value.addresses.filter(a => a.id !== addressId);
            const userDocRef = doc(db, 'users', userProfile.value.uid);
            await updateDoc(userDocRef, { addresses: newAddresses });

            userProfile.value.addresses = newAddresses;
        } catch (error) {
            console.error("Error removing address:", error);
            throw error;
        }
    };

    // --- Admin Functions ---

    const fetchAllUsers = async () => {
        try {
            const usersCol = collection(db, 'users');
            const snapshot = await getDocs(usersCol);
            return snapshot.docs.map(doc => doc.data() as UserProfile);
        } catch (error) {
            console.error("Error fetching all users:", error);
            throw error;
        }
    };

    const fetchUserAddresses = async (uid: string) => {
        try {
            const userDocRef = doc(db, 'users', uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                return (userDoc.data() as UserProfile).addresses || [];
            }
            return [];
        } catch (error) {
            console.error("Error fetching user addresses:", error);
            throw error;
        }
    };

    const fetchUsersByRole = async (role: string) => {
        try {
            const usersCol = collection(db, 'users');
            const q = query(usersCol, where('roles', 'array-contains', role));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => doc.data() as UserProfile);
        } catch (error) {
            console.error("Error fetching users by role:", error);
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
        await updateDoc(userDocRef, updates);
        await fetchUserProfile(userProfile.value.uid); // Refresh
    };

    const migrateSubcollection = async (sourceUid: string, targetUid: string, collectionName: string) => {
        const sourceRef = collection(db, 'users', sourceUid, collectionName);
        const targetRef = collection(db, 'users', targetUid, collectionName);
        const sourceSnapshot = await getDocs(sourceRef);

        for (const sourceDoc of sourceSnapshot.docs) {
            const data = sourceDoc.data();
            const targetDocRef = doc(targetRef, sourceDoc.id);
            const targetDocSnap = await getDoc(targetDocRef);

            if (!targetDocSnap.exists()) {
                await setDoc(targetDocRef, data);
            }
        }
    };

    const mergeUserData = async (sourceUid: string, targetUid: string) => {
        try {
            const sourceDocRef = doc(db, 'users', sourceUid);
            const targetDocRef = doc(db, 'users', targetUid);

            const sourceDoc = await getDoc(sourceDocRef);
            const targetDoc = await getDoc(targetDocRef);

            if (!sourceDoc.exists()) return;

            const sourceData = sourceDoc.data() as UserProfile;
            const targetData = targetDoc.exists() ? (targetDoc.data() as UserProfile) : {} as UserProfile;

            // Merge Logic
            const mergedData: Partial<UserProfile> = {
                ...targetData,
                roles: Array.from(new Set([...(targetData.roles || []), ...(sourceData.roles || [])])),
                addresses: [...(targetData.addresses || []), ...(sourceData.addresses || [])],
                // Prefer target data for single fields, fallback to source
                phoneNumber: targetData.phoneNumber || sourceData.phoneNumber,
                photoURL: targetData.photoURL || sourceData.photoURL,
                displayName: targetData.displayName || sourceData.displayName,
            };

            // Merge profiles if they don't exist in target
            if (sourceData.vendorProfile && !targetData.vendorProfile) {
                mergedData.vendorProfile = sourceData.vendorProfile;
            }
            if (sourceData.deliveryProfile && !targetData.deliveryProfile) {
                mergedData.deliveryProfile = sourceData.deliveryProfile;
            }
            if (sourceData.managerProfile && !targetData.managerProfile) {
                mergedData.managerProfile = sourceData.managerProfile;
            }

            await setDoc(targetDocRef, mergedData, { merge: true });

            // --- Migrate Subcollections ---
            // 1. Wishlist: Keep existing, add new
            await migrateSubcollection(sourceUid, targetUid, 'wishlist');

            // 2. Tracking Sessions: Copy all
            await migrateSubcollection(sourceUid, targetUid, 'tracking_sessions');

            // Optional: Delete source doc or mark as merged
            // await deleteDoc(sourceDocRef); 
        } catch (error) {
            console.error("Error merging user data:", error);
            throw error;
        }
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
        addRole,
        mergeUserData,
        updateAddress,
        fetchAllUsers,
        fetchUserAddresses,
        fetchUsersByRole
    };
}
