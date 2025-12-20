import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

export function useCreateStorePage() {
    const router = useRouter();
    const { createStore, loading, error } = useVendor();
    const { showToast } = useToast();

    const formData = reactive({
        name: '',
        description: '',
        category: '',
        logoUrl: ''
    });

    const categories = [
        { label: 'Fashion', value: 'fashion' },
        { label: 'Electronics', value: 'electronics' },
        { label: 'Home & Living', value: 'home' },
        { label: 'Beauty', value: 'beauty' }
    ];

    const handleSubmit = async () => {
        if (!formData.name || !formData.description || !formData.category) {
            showToast('Please fill in all required fields', 'warning');
            return;
        }

        try {
            const storeId = await createStore(formData);
            showToast('Store created! Let\'s set it up. 🚀', 'success');
            router.push(`/vendor/store/${storeId}/onboarding`);
        } catch (e) {
            showToast('Failed to create store', 'error');
        }
    };

    return {
        formData,
        categories,
        loading,
        error,
        handleSubmit
    };
}
