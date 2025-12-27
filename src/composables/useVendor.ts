import { ref } from 'vue';
import { doc, updateDoc, collection, addDoc, getDocs, getDoc, deleteDoc, query, where, serverTimestamp, arrayUnion, onSnapshot, limit, Timestamp, runTransaction } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref as refStorage, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from './useAuth';
import { compressImage } from '../utils/imageOptimizer';

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
                roles: arrayUnion('vendor'),
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

    const uploadFile = async (file: File, path: string) => {
        if (!user.value) throw new Error("User not authenticated");
        try {
            const storageRef = refStorage(storage, path);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (e: any) {
            console.error('Error uploading file:', e);
            throw e;
        }
    };

    const uploadKYC = async (videoFile: File, docFile: File) => {
        if (!user.value) throw new Error("User not authenticated");
        loading.value = true;
        try {
            const timestamp = Date.now();
            const videoPath = `kyc/${user.value.uid}/video_${timestamp}_${videoFile.name}`;
            const docPath = `kyc/${user.value.uid}/doc_${timestamp}_${docFile.name}`;

            const [videoUrl, docUrl] = await Promise.all([
                uploadFile(videoFile, videoPath),
                uploadFile(docFile, docPath)
            ]);

            // Save to user profile for future reuse
            const userRef = doc(db, 'users', user.value.uid);
            await updateDoc(userRef, {
                kycDocuments: {
                    videoUrl,
                    docUrl,
                    videoName: videoFile.name,
                    docName: docFile.name,
                    uploadedAt: serverTimestamp()
                }
            });

            return { videoUrl, docUrl };
        } catch (e: any) {
            console.error('Error uploading KYC:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchUserKYC = async () => {
        if (!user.value) return null;
        try {
            const userRef = doc(db, 'users', user.value.uid);
            const snap = await getDoc(userRef);

            // 1. Try to get from user profile
            if (snap.exists() && snap.data().kycDocuments) {
                return snap.data().kycDocuments;
            }

            // 2. Fallback: Check existing stores (Legacy support)
            const storesRef = collection(db, 'stores');
            const q = query(
                storesRef,
                where('ownerId', '==', user.value.uid),
                where('kycStatus', '==', 'submitted'),
                limit(1)
            );
            const storeSnap = await getDocs(q);

            if (!storeSnap.empty) {
                const storeData: any = storeSnap.docs[0]!.data();
                if (storeData.kycVideoUrl && storeData.kycDocUrl) {
                    const kycData = {
                        videoUrl: storeData.kycVideoUrl,
                        docUrl: storeData.kycDocUrl,
                        videoName: 'Existing Video', // Fallback name
                        docName: 'Existing Document', // Fallback name
                        uploadedAt: serverTimestamp()
                    };

                    // Migrate to user profile for future
                    await updateDoc(userRef, { kycDocuments: kycData });

                    return kycData;
                }
            }

            return null;
        } catch (e) {
            console.error('Error fetching user KYC:', e);
            return null;
        }
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
            const snap = await getDoc(storeRef);
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

    const subscribeToStore = (storeId: string, callback: (data: any) => void) => {
        const storeRef = doc(db, 'stores', storeId);
        return onSnapshot(storeRef, (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() });
            }
        });
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

    const subscribeToMyStores = (callback: (stores: any[]) => void) => {
        if (!user.value) return () => { };
        const storesRef = collection(db, 'stores');
        const q = query(storesRef, where('ownerId', '==', user.value.uid));
        return onSnapshot(q, (snapshot) => {
            const stores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(stores);
        });
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

    const fetchStoreStats = async (storeId: string) => {
        if (!user.value) return null;
        loading.value = true;
        try {
            // In a real app with many items, use aggregation queries or counters
            const productsRef = collection(db, 'products');
            const productsQ = query(productsRef, where('storeId', '==', storeId));
            const productsSnap = await getDocs(productsQ);
            const productCount = productsSnap.size;

            const ordersRef = collection(db, 'orders');
            const ordersQ = query(ordersRef, where('storeId', '==', storeId));
            const ordersSnap = await getDocs(ordersQ);
            const orderCount = ordersSnap.size;

            // Calculate total sales
            let totalSales = 0;
            ordersSnap.forEach(doc => {
                const data = doc.data();
                totalSales += (data.totalAmount || 0);
            });

            // Store views (assuming it's a field on the store doc, fetched separately or passed in)
            // For now, we'll return what we calculated
            return {
                products: productCount,
                orders: orderCount,
                sales: totalSales,
                views: 0 // Placeholder or fetch from store doc if it exists
            };
        } catch (e: any) {
            console.error('Error fetching store stats:', e);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const createProduct = async (storeId: string, productData: any, images: File[]) => {
        if (!user.value) throw new Error("User not authenticated");
        loading.value = true;
        error.value = null;

        try {
            // 1. Upload Images
            const imageUrls: string[] = [];
            const timestamp = Date.now();

            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                if (file) {
                    // Compress image before upload
                    const compressedFile = await compressImage(file);
                    const path = `products/${storeId}/${timestamp}_${i}_${file.name}`;
                    const url = await uploadFile(compressedFile, path);
                    imageUrls.push(url);
                }
            }

            // 2. Create Product Document
            const productsRef = collection(db, 'products');
            const newProduct = {
                storeId,
                ...productData,
                images: imageUrls,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'active',
                rating: 0,
                reviewCount: 0,
                views: 0,
                sales: 0
            };

            const docRef = await addDoc(productsRef, newProduct);
            return docRef.id;
        } catch (e: any) {
            console.error('Error creating product:', e);
            error.value = e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchProducts = async (storeId: string) => {
        loading.value = true;
        try {
            const productsRef = collection(db, 'products');
            const q = query(productsRef, where('storeId', '==', storeId));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Error fetching products:', e);
            return [];
        } finally {
            loading.value = false;
        }
    };

    const getProduct = async (productId: string) => {
        loading.value = true;
        try {
            const productRef = doc(db, 'products', productId);
            const snap = await getDoc(productRef);
            if (snap.exists()) {
                return { id: snap.id, ...snap.data() };
            }
            return null;
        } catch (e: any) {
            console.error('Error fetching product:', e);
            return null;
        } finally {
            loading.value = false;
        }
    };

    const updateProduct = async (productId: string, data: any, newImages?: File[]) => {
        if (!user.value) return;
        loading.value = true;
        try {
            const productRef = doc(db, 'products', productId);

            let updatedData = { ...data, updatedAt: serverTimestamp() };

            // Handle new images if provided
            if (newImages && newImages.length > 0) {
                const currentDoc = await getDoc(productRef);
                const currentData = currentDoc.data();
                const storeId = currentData?.storeId;

                const imageUrls: string[] = [];
                const timestamp = Date.now();

                for (let i = 0; i < newImages.length; i++) {
                    const file = newImages[i];
                    if (file) {
                        const path = `products/${storeId}/${timestamp}_${i}_${file.name}`;
                        const url = await uploadFile(file, path);
                        imageUrls.push(url);
                    }
                }

                // Append new images to existing ones or replace? 
                // For now, let's assume we append. The UI should handle removal separately.
                updatedData.images = arrayUnion(...imageUrls);
            }

            await updateDoc(productRef, updatedData);
        } catch (e: any) {
            console.error('Error updating product:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const deleteProduct = async (productId: string) => {
        if (!user.value) return;
        loading.value = true;
        try {
            await deleteDoc(doc(db, 'products', productId));
        } catch (e: any) {
            console.error('Error deleting product:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const fetchStoreOrders = async (storeId: string, limitCount = 5) => {
        if (!user.value) return [];
        loading.value = true;
        try {
            const ordersRef = collection(db, 'orders');
            // Assuming 'createdAt' field exists
            const q = query(ordersRef, where('storeId', '==', storeId), limit(limitCount));
            // Note: Composite index might be needed for ordering by date with filter
            // const q = query(ordersRef, where('storeId', '==', storeId), orderBy('createdAt', 'desc'), limit(limitCount));

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Error fetching store orders:', e);
            return [];
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
        toggleStoreStatus,
        subscribeToStore,
        subscribeToMyStores,
        fetchStoreStats,
        fetchStoreOrders,
        createProduct,
        fetchProducts,
        getProduct,
        updateProduct,
        deleteProduct,
        uploadFile,
        fetchUserKYC,
        // Staff Management
        createInviteLink,
        fetchInvite,
        applyForPosition,
        fetchPendingApplications,
        approveApplication,
        rejectApplication,
        fetchStoreStaff,
        removeStaff
    };

    // --- Staff Management Implementations ---

    async function createInviteLink(storeId: string, role: string) {
        if (!user.value) throw new Error("User not authenticated");
        loading.value = true;
        try {
            const invitesRef = collection(db, 'store_invites');
            // Create a document with auto-generated ID as the token
            const docRef = await addDoc(invitesRef, {
                storeId,
                role,
                status: 'active',
                createdAt: serverTimestamp(),
                createdBy: user.value.uid,
                expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days expiry
            });
            // Return the full URL (assuming current host)
            return `${window.location.origin}/vendor/join/${docRef.id}`;
        } catch (e: any) {
            console.error('Error creating invite:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function fetchInvite(token: string) {
        loading.value = true;
        try {
            const inviteRef = doc(db, 'store_invites', token);
            const snap = await getDoc(inviteRef);
            if (snap.exists()) {
                return { id: snap.id, ...snap.data() };
            }
            return null;
        } catch (e: any) {
            console.error('Error fetching invite:', e);
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function applyForPosition(token: string, applicantData: any) {
        if (!user.value) throw new Error("User not authenticated");
        loading.value = true;
        try {
            const inviteRef = doc(db, 'store_invites', token);
            await updateDoc(inviteRef, {
                status: 'applied',
                applicantUid: user.value.uid,
                applicantData: {
                    ...applicantData,
                    email: user.value.email, // Ensure verified email is used
                    appliedAt: new Date().toISOString()
                }
            });
        } catch (e: any) {
            console.error('Error applying for position:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function fetchPendingApplications(storeId: string) {
        if (!user.value) return [];
        loading.value = true;
        try {
            const invitesRef = collection(db, 'store_invites');
            const q = query(
                invitesRef,
                where('storeId', '==', storeId),
                where('status', '==', 'applied')
            );
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Error fetching applications:', e);
            return [];
        } finally {
            loading.value = false;
        }
    }

    async function approveApplication(inviteId: string) {
        if (!user.value) throw new Error("User not authenticated");
        loading.value = true;
        try {
            await runTransaction(db, async (transaction) => {
                // 1. Get Invite
                const inviteRef = doc(db, 'store_invites', inviteId);
                const inviteSnap = await transaction.get(inviteRef);

                if (!inviteSnap.exists()) throw new Error("Invite not found");
                const inviteData: any = inviteSnap.data();

                if (inviteData.status !== 'applied') throw new Error("Invite status invalid");

                // Note: We DO NOT add to staff collection yet. That happens after Admin approval.

                // 2. Update Invite Status to 'pending_admin'
                transaction.update(inviteRef, {
                    status: 'pending_admin',
                    ownerApprovedAt: serverTimestamp()
                });

                // 3. Notify Applicant
                const notificationRef = doc(collection(db, 'users', inviteData.applicantUid, 'notifications'));
                transaction.set(notificationRef, {
                    title: 'Application Approved by Store',
                    message: `Your application to ${inviteData.storeName || 'the store'} has been approved by the owner. It is now waiting for final system verification.`,
                    type: 'application_status',
                    read: false,
                    createdAt: serverTimestamp(),
                    storeId: inviteData.storeId
                });

                // 4. Admin Notification (Conceptually handled by status change to 'pending_admin')
            });
        } catch (e: any) {
            console.error('Error approving application:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function rejectApplication(inviteId: string, reason: string) {
        if (!user.value) throw new Error("User not authenticated");
        loading.value = true;
        try {
            const inviteRef = doc(db, 'store_invites', inviteId);
            await updateDoc(inviteRef, {
                status: 'rejected',
                rejectionReason: reason,
                rejectedAt: serverTimestamp()
            });
        } catch (e: any) {
            console.error('Error rejecting application:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function fetchStoreStaff(storeId: string) {
        if (!user.value) return [];
        loading.value = true;
        try {
            const staffRef = collection(db, 'stores', storeId, 'staff');
            const snapshot = await getDocs(staffRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e: any) {
            console.error('Error fetching staff:', e);
            return [];
        } finally {
            loading.value = false;
        }
    }

    async function removeStaff(storeId: string, staffUid: string) {
        if (!user.value) return;
        loading.value = true;
        try {
            const staffRef = doc(db, 'stores', storeId, 'staff', staffUid);
            await deleteDoc(staffRef);
        } catch (e: any) {
            console.error('Error removing staff:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    }
}