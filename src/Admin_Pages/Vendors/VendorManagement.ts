import { ref, onMounted, onUnmounted, computed } from 'vue';
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
    let unsubscribe: any = null;

    onMounted(() => {
        loading.value = true;
        unsubscribe = subscribeToStores((stores) => {
            vendors.value = stores;
            loading.value = false;
        });
    });

    onUnmounted(() => {
        if (unsubscribe) unsubscribe();
    });

    const filteredVendors = computed(() => {
        if (!searchQuery.value) return vendors.value;
        const query = searchQuery.value.toLowerCase();
        return vendors.value.filter(v =>
            (v.email && v.email.toLowerCase().includes(query)) ||
            (v.displayName && v.displayName.toLowerCase().includes(query))
        );
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

    const confirmReject = async () => {
        if (!selectedVendor.value) return;

        // Compile unverified fields
        const unverified = requiredFields.filter(f => !verifiedFields.value[f]);
        const reason = `
            Review Note: ${rejectionNote.value || 'No specific note provided.'}
            Issues found with: ${unverified.length > 0 ? unverified.join(', ') : 'General mismatch'}
        `.trim();

        try {
            await rejectKYC(selectedVendor.value.id, reason);
            showToast(`Vendor rejected. Feedback sent.`, 'info');
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
        confirmReject
    };
}
