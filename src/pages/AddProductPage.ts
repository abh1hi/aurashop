import { defineComponent, ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidStepper from '../components/liquid-ui-kit/LiquidStepper/LiquidStepper.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidFileUpload from '../components/liquid-ui-kit/LiquidFileUpload/LiquidFileUpload.vue';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast.js';
import { useVendor } from '../composables/useVendor';

export default defineComponent({
    name: 'AddProductPage',
    components: {
        AppHeader,
        BottomNavBar,
        LiquidStepper,
        LiquidInput,
        LiquidDropdown,
        LiquidButton,
        LiquidFileUpload
    },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const { showToast } = useToast();
        const { createProduct, loading: vendorLoading } = useVendor();

        const currentStep = ref(0);
        const submitting = ref(false);

        const steps = [
            { label: 'Essentials' },
            { label: 'Visuals' },
            { label: 'Details' },
            { label: 'Review' }
        ];

        const categories = [
            { label: 'Clothing', value: 'clothing' },
            { label: 'Electronics', value: 'electronics' },
            { label: 'Home & Garden', value: 'home' },
            { label: 'Beauty', value: 'beauty' },
            { label: 'Accessories', value: 'accessories' }
        ];

        const formData = reactive({
            name: '',
            description: '',
            category: '',
            images: [] as File[],
            price: '',
            comparePrice: '',
            stock: '',
            sku: ''
        });

        // Computed property to get the first image for preview
        const previewImage = computed(() => {
            if (formData.images && formData.images.length > 0) {
                const file = formData.images[0];
                return URL.createObjectURL(file);
            }
            return null;
        });

        const getCategoryLabel = (value: string) => {
            const cat = categories.find(c => c.value === value);
            return cat ? cat.label : value;
        };

        const handleSubmit = async () => {
            if (!formData.name || !formData.price) {
                showToast('Please fill in required fields', 'error');
                return;
            }

            submitting.value = true;
            try {
                const storeId = route.params.id as string;

                // Prepare data (exclude images as they are passed separately)
                const productPayload = {
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    price: Number(formData.price),
                    comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
                    stock: Number(formData.stock),
                    sku: formData.sku
                };

                await createProduct(storeId, productPayload, formData.images);

                showToast('Product published successfully!', 'success');
                router.push(`/vendor/store/${storeId}/dashboard`);
            } catch (e: any) {
                console.error(e);
                showToast(e.message || 'Failed to publish product', 'error');
            } finally {
                submitting.value = false;
            }
        };

        return {
            router,
            currentStep,
            submitting,
            steps,
            categories,
            formData,
            previewImage,
            getCategoryLabel,
            handleSubmit
        };
    }
});
