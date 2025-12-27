import { ref, onMounted, onUnmounted, computed } from 'vue';
import { getFirestore, doc, getDoc, collection, query, where, getCountFromServer } from 'firebase/firestore';
import { useAdmin } from '../../composables/useAdmin';
import { useToast } from '../../components/liquid-ui-kit/LiquidToast/LiquidToast';
import vendorCats from '../../../vendorcat.json';

export function useVendorManagementLogic() {
    const { subscribeToStores, loading, approveKYC, rejectKYC } = useAdmin();
    const { showToast } = useToast();

    const vendors = ref<any[]>([]);
    const searchQuery = ref('');
    const showModal = ref(false);
    const selectedVendor = ref<any>(null);
    const previewUrl = ref('');
    const previewType = ref<'video' | 'pdf' | null>(null);
    const activeTab = ref<'profile' | 'verification'>('profile');
    const activeTemplateTab = ref<'approval' | 'rejection'>('approval');
    let unsubscribe: any = null;

    const showTemplateModal = ref(false);
    const successTemplate = ref('Your store has been verified and is now active.');
    const rejectTemplate = ref(`Application Rejected.

Reason from Admin:
"{{admin_note}}"

Action Required:
Please correct or update the following details which were found to be incomplete or incorrect:
- {{missing_fields}}

Please update these details in your onboarding form and resubmit.`);

    const saveTemplates = () => {
        localStorage.setItem('vendor_success_template', successTemplate.value);
        localStorage.setItem('vendor_reject_template', rejectTemplate.value);
        showTemplateModal.value = false;
        showToast('Templates saved successfully', 'success');
    };

    onMounted(() => {
        loading.value = true;
        unsubscribe = subscribeToStores((stores) => {
            vendors.value = stores;
            loading.value = false;
        });

        // Load templates
        const savedSuccess = localStorage.getItem('vendor_success_template');
        if (savedSuccess) successTemplate.value = savedSuccess;

        const savedReject = localStorage.getItem('vendor_reject_template');
        if (savedReject) rejectTemplate.value = savedReject;
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    const filterStatus = ref('all');
    const sortOrder = ref('newest');

    const filteredVendors = computed(() => {
        let result = vendors.value;

        // 1. Search
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            result = result.filter(v =>
                (v.email && v.email.toLowerCase().includes(query)) ||
                (v.displayName && v.displayName.toLowerCase().includes(query)) ||
                (v.name && v.name.toLowerCase().includes(query))
            );
        }

        // 2. Filter Status
        if (filterStatus.value !== 'all') {
            result = result.filter(v => {
                const s = (v.kycStatus || 'pending').toLowerCase();
                return s === filterStatus.value; // 'pending', 'approved', 'rejected'
            });
        }

        // 3. Sort
        result = [...result].sort((a, b) => {
            if (sortOrder.value === 'name') {
                return (a.name || '').localeCompare(b.name || '');
            }

            // Date Sort (Newest First Default)
            const dateA = a.createdAt?.seconds ? a.createdAt.seconds : (new Date(a.createdAt).getTime() / 1000);
            const dateB = b.createdAt?.seconds ? b.createdAt.seconds : (new Date(b.createdAt).getTime() / 1000);

            return sortOrder.value === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return result;
    });

    const getInitials = (name: string) => {
        if (!name) return 'V';
        return name.charAt(0).toUpperCase();
    };

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '-';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(date);
    };

    const getKYCStatusClass = (status: string) => {
        if (!status) return 'pending';
        return status.toLowerCase();
    };

    const verifiedFields = ref<Record<string, boolean>>({});
    const showRejectionDialog = ref(false);
    const rejectionNote = ref('');

    // Owner Hover State
    const hoveredOwner = ref<any>(null);
    const isFetchingOwner = ref(false);

    // Cache owner details to avoid repeated fetches
    const ownerCache = ref<Record<string, any>>({});

    // Fields that must be checked to approve
    const requiredFields = [
        'branding', 'name', 'category', 'description', 'address',
        'hours', 'phone', 'email', 'bankName', 'account', 'ifsc',
        'doc', 'video'
    ];

    const isAllVerified = computed(() => {
        return requiredFields.every(field => verifiedFields.value[field]);
    });

    const closeModal = () => {
        showModal.value = false;
        selectedVendor.value = null;
        clearPreview();
    };

    const loadPreview = (url: string, type: 'video' | 'pdf') => {
        console.log('Previewing:', url, type);
        previewUrl.value = url;
        previewType.value = type;
    };

    const clearPreview = () => {
        previewUrl.value = '';
        previewType.value = null;
    };

    const handleOwnerHover = async (uid: string) => {
        if (!uid) return;

        // Toggle Logic: If clicking the same owner again, close it
        if (hoveredOwner.value?.uid === uid) {
            hoveredOwner.value = null;
            return;
        }

        // Check cache
        if (ownerCache.value[uid]) {
            hoveredOwner.value = ownerCache.value[uid];
            return;
        }

        isFetchingOwner.value = true;
        // Temporary placeholder while loading
        hoveredOwner.value = { uid, loading: true };

        try {
            const db = getFirestore();

            // 1. Get User Profile
            const userSnap = await getDoc(doc(db, 'users', uid));
            const userData = userSnap.exists() ? userSnap.data() : {};

            // 2. Count Stores Owned
            const storesQuery = query(collection(db, 'stores'), where('ownerId', '==', uid));
            const countSnap = await getCountFromServer(storesQuery);
            const storeCount = countSnap.data().count;

            const details = {
                uid,
                name: userData.displayName || userData.name || 'Unknown',
                email: userData.email || 'No Email',
                role: userData.role || 'User', // Assuming role field exists
                storeCount,
                avatarUrl: userData.photoURL || userData.avatarUrl,
                loading: false
            };

            ownerCache.value[uid] = details;
            hoveredOwner.value = details;
        } catch (e) {
            console.error('Error fetching owner details:', e);
            hoveredOwner.value = { uid, error: true };
        } finally {
            isFetchingOwner.value = false;
        }
    };

    const getCategoryName = (id: string) => {
        const categories = (vendorCats as any).categories;
        for (const group in categories) {
            const items = categories[group];
            if (items) {
                const found = items.find((c: any) => c.id === id);
                if (found) return found.name;
            }
        }
        return id || 'Uncategorized';
    };

    const openReviewModal = (vendor: any) => {
        selectedVendor.value = vendor;
        // Reset verification state
        verifiedFields.value = {};
        rejectionNote.value = '';
        showRejectionDialog.value = false;
        showModal.value = true;
    };

    const toggleVerification = (field: string) => {
        verifiedFields.value[field] = !verifiedFields.value[field];
    };

    const handleApprove = async (vendor: any) => {
        if (!isAllVerified.value) {
            showToast('Please verify all details before approving.', 'warning');
            return;
        }
        try {
            await approveKYC(vendor.id);
            showToast(`Vendor ${vendor.displayName || vendor.name} approved!`, 'success');
            closeModal();
        } catch (e: any) {
            showToast(`Failed to approve vendor: ${e.message}`, 'error');
        }
    };

    const promptReject = () => {
        showRejectionDialog.value = true;
    }

    // Readable names for fields
    const fieldLabels: Record<string, string> = {
        branding: 'Store Logo/Branding',
        name: 'Store Name',
        category: 'Business Category',
        description: 'Store Description',
        address: 'Business Address',
        hours: 'Operating Hours',
        phone: 'Phone Number',
        email: 'Email Address',
        bankName: 'Bank Name',
        account: 'Account Number',
        ifsc: 'IFSC/Routing Code',
        doc: 'Government ID',
        video: 'Liveness Video Probe'
    };

    const confirmReject = async () => {
        if (!selectedVendor.value) return;

        // Compile unverified fields with readable names
        const unverifiedKeys = requiredFields.filter(f => !verifiedFields.value[f]);
        const unverifiedNames = unverifiedKeys.map(k => fieldLabels[k] || k);

        // Template Message
        const reason = `
Application Rejected.

Reason from Admin:
"${rejectionNote.value || 'Does not meet verification criteria.'}"

Action Required:
Please correct or update the following details which were found to be incomplete or incorrect:
- ${unverifiedNames.length > 0 ? unverifiedNames.join('\n- ') : 'General Review Failed'}

Please update these details in your onboarding form and resubmit.
        `.trim();

        try {
            await rejectKYC(selectedVendor.value.id, reason);
            showToast(`Vendor rejected. Detailed feedback sent.`, 'info');
            closeModal();
        } catch (e: any) {
            showToast(`Failed to reject vendor: ${e.message}`, 'error');
        }
    };

    const handleReject = (vendor: any) => {
        openReviewModal(vendor);
        promptReject();
    };

    return {
        loading,
        vendors,
        searchQuery,
        showModal,
        selectedVendor,
        previewUrl,
        previewType,
        activeTab,
        filteredVendors,
        verifiedFields,
        isAllVerified,
        showRejectionDialog,
        rejectionNote,
        getInitials,
        formatDate,
        getKYCStatusClass,
        openReviewModal,
        closeModal,
        loadPreview,
        clearPreview,
        getCategoryName,
        toggleVerification,
        handleApprove,
        handleReject,
        promptReject,
        confirmReject,
        showTemplateModal,
        successTemplate,
        rejectTemplate,
        saveTemplates,
        activeTemplateTab,
        filterStatus,
        sortOrder,
        hoveredOwner,
        handleOwnerHover,
        isFetchingOwner
    };
}
