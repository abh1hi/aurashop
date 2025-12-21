import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useVendor } from '../composables/useVendor';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';

export function useEditProductPage() {
    const router = useRouter();
    const route = useRoute();
    const { getProduct, updateProduct, deleteProduct } = useVendor();
    const { showToast } = useToast();

    const loading = ref(true);
    const submitting = ref(false);
    const existingImages = ref<string[]>([]);
    const newImages = ref<File[]>([]);

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
        price: '',
        comparePrice: '',
        stock: '',
        sku: ''
    });

    const getCategoryLabel = (value: string) => {
        const cat = categories.find(c => c.value === value);
        return cat ? cat.label : value;
    };

    const previewImage = computed(() => {
        if (newImages.value.length > 0 && newImages.value[0]) {
            return URL.createObjectURL(newImages.value[0]);
        }
        if (existingImages.value.length > 0) {
            return existingImages.value[0];
        }
        return null;
    });

    const removeExistingImage = (index: number) => {
        existingImages.value.splice(index, 1);
    };

    const loadProductData = async () => {
        const productId = route.params.productId as string;
        if (productId) {
            const product = await getProduct(productId) as any;
            if (product) {
                formData.name = product.name;
                formData.description = product.description;
                formData.category = product.category;
                formData.price = product.price.toString();
                formData.comparePrice = product.comparePrice ? product.comparePrice.toString() : '';
                formData.stock = product.stock.toString();
                formData.sku = product.sku || '';
                existingImages.value = product.images || [];
            } else {
                showToast('Product not found', 'error');
                router.back();
            }
        }
        loading.value = false;
    };

    onMounted(() => {
        loadProductData();
    });

    const handleUpdate = async () => {
        submitting.value = true;
        try {
            const productId = route.params.productId as string;

            const updateData = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                price: Number(formData.price),
                comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
                stock: Number(formData.stock),
                sku: formData.sku,
                images: existingImages.value
            };

            await updateProduct(productId, updateData, newImages.value);
            showToast('Product updated successfully', 'success');
            router.back();
        } catch (e) {
            showToast('Failed to update product', 'error');
            console.error(e);
        } finally {
            submitting.value = false;
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure? This cannot be undone.')) {
            try {
                await deleteProduct(route.params.productId as string);
                showToast('Product deleted', 'success');
                router.back();
            } catch (e) {
                showToast('Failed to delete product', 'error');
            }
        }
    };

    return {
        loading,
        submitting,
        formData,
        categories,
        existingImages,
        newImages,
        previewImage,
        getCategoryLabel,
        removeExistingImage,
        handleUpdate,
        handleDelete,
        router
    };
}
