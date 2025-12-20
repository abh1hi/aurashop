import { useRouter } from 'vue-router';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

export const useVendorOnboardingLogic = () => {
    const router = useRouter();
    const { becomeVendor, loading, error } = useVendor();
    const { showToast } = useToast();

    /**
     * Handles the vendor registration process.
     * Prevents multiple concurrent calls and adds basic security flow.
     */
    const handleStartSelling = async () => {
        if (loading.value) return;

        try {
            // We can add pre-registration checks or data sanitization here
            // even if there are no explicit inputs yet.

            await becomeVendor();
            showToast('Welcome to the Vendor Program! 🎉', 'success');
            router.push('/vendor/create-store');
        } catch (e: any) {
            console.error('[VendorOnboarding] Registration error:', e);
            const errorMessage = e.message || 'Failed to join vendor program';
            showToast(errorMessage, 'error');
        }
    };

    return {
        loading,
        error,
        handleStartSelling
    };
};
