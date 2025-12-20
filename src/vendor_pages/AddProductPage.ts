import { defineComponent, ref, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import BottomNavBar from '../components/BottomNavBar.vue';
import LiquidStepper from '../components/liquid-ui-kit/LiquidStepper/LiquidStepper.vue';
import LiquidInput from '../components/liquid-ui-kit/LiquidInput/LiquidInput.vue';
import LiquidDropdown from '../components/liquid-ui-kit/LiquidDropdown/LiquidDropdown.vue';
import LiquidButton from '../components/liquid-ui-kit/LiquidButton/LiquidButton.vue';
import LiquidFileUpload from '../components/liquid-ui-kit/LiquidFileUpload/LiquidFileUpload.vue';
import { useToast } from '../components/liquid-ui-kit/LiquidToast/LiquidToast';
import { useVendor } from '../composables/useVendor';
import type { ProductOption, ProductVariant } from '../types/Product';

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
        const { createProduct } = useVendor();

        const currentStep = ref(0);
        const submitting = ref(false);

        const steps = [
            { label: 'Essentials' },
            { label: 'Visuals' },
            { label: 'Pricing' },
            { label: 'Variants' },
            { label: 'Advanced' },
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
            subCategory: '',
            brand: '',
            tags: [] as string[],
            images: [] as File[],
            price: '',
            comparePrice: '',
            costPrice: '',
            stock: '',
            sku: '',
            material: '',
            careInstructions: '',
            warranty: '',
            returnPolicy: '',
            weight: '',
            dimensions: { length: '', width: '', height: '' },
            options: [] as ProductOption[],
            variants: [] as ProductVariant[],
            seo: {
                title: '',
                description: '',
                keywords: '',
                canonicalUrl: ''
            },
            status: 'active'
        });

        // Computed property to get the first image for preview
        const previewImage = computed(() => {
            if (formData.images && formData.images.length > 0) {
                const file = formData.images[0];
                if (file) {
                    return URL.createObjectURL(file);
                }
            }
            return null;
        });

        const getCategoryLabel = (value: string) => {
            const cat = categories.find(c => c.value === value);
            return cat?.label || value;
        };

        // Variant Logic
        const newOptionName = ref('');
        const newOptionValues = ref('');

        const addOption = () => {
            if (newOptionName.value && newOptionValues.value) {
                const values = newOptionValues.value.split(',').map(v => v.trim()).filter(v => v);
                if (values.length > 0) {
                    formData.options.push({
                        name: newOptionName.value,
                        values: values
                    });
                    newOptionName.value = '';
                    newOptionValues.value = '';
                    generateVariants();
                }
            }
        };

        const removeOption = (index: number) => {
            formData.options.splice(index, 1);
            generateVariants();
        };

        const generateVariants = () => {
            if (formData.options.length === 0) {
                formData.variants = [];
                return;
            }

            const cartesian = (args: string[][]) => {
                const r: string[][] = [];
                const max = args.length - 1;
                function helper(arr: string[], i: number) {
                    if (!args[i]) return;
                    for (let j = 0, l = args[i].length; j < l; j++) {
                        const a = arr.slice(0); // clone arr
                        const val = args[i][j];
                        if (val) {
                            a.push(val);
                        }
                        if (i == max)
                            r.push(a);
                        else
                            helper(a, i + 1);
                    }
                }
                helper([], 0);
                return r;
            };

            const optionValues = formData.options.map(o => o.values);
            const combinations = cartesian(optionValues);

            formData.variants = combinations.map((combo, index) => {
                const optionsMap: { [key: string]: string } = {};
                let nameParts: string[] = [];

                formData.options.forEach((opt, i) => {
                    if (opt && combo[i]) {
                        optionsMap[opt.name] = combo[i];
                        nameParts.push(`${opt.name}: ${combo[i]}`);
                    }
                });

                return {
                    id: `var_${Date.now()}_${index}`,
                    name: nameParts.join(' / '),
                    options: optionsMap,
                    price: Number(formData.price) || 0,
                    stock: Number(formData.stock) || 0,
                    sku: `${formData.sku || 'SKU'}-${index + 1}`
                };
            });
        };

        const handleSubmit = async () => {
            if (!formData.name || !formData.price) {
                showToast('Please fill in required fields', 'error');
                return;
            }

            submitting.value = true;
            try {
                const storeId = (route.params.id as string) || '';
                if (!storeId) throw new Error("Store ID is missing");

                // Prepare data (exclude images as they are passed separately)
                const productPayload = {
                    name: formData.name,
                    description: formData.description,
                    category: formData.category,
                    subCategory: formData.subCategory,
                    brand: formData.brand,
                    tags: formData.tags,
                    price: Number(formData.price),
                    comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
                    costPrice: formData.costPrice ? Number(formData.costPrice) : null,
                    stock: Number(formData.stock),
                    sku: formData.sku,
                    material: formData.material,
                    careInstructions: formData.careInstructions,
                    warranty: formData.warranty,
                    returnPolicy: formData.returnPolicy,
                    weight: formData.weight ? Number(formData.weight) : null,
                    dimensions: {
                        length: formData.dimensions.length ? Number(formData.dimensions.length) : null,
                        width: formData.dimensions.width ? Number(formData.dimensions.width) : null,
                        height: formData.dimensions.height ? Number(formData.dimensions.height) : null
                    },
                    options: formData.options,
                    variants: formData.variants,
                    seo: {
                        title: formData.seo.title || formData.name,
                        description: formData.seo.description || formData.description.substring(0, 160),
                        keywords: formData.seo.keywords ? formData.seo.keywords.split(',').map(k => k.trim()) : formData.tags,
                        canonicalUrl: formData.seo.canonicalUrl
                    },
                    status: formData.status
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

        const validateStep = (step: number): boolean => {
            switch (step) {
                case 0: // Essentials
                    if (!formData.name) {
                        showToast('Product Name is required', 'error');
                        return false;
                    }
                    if (!formData.description) {
                        showToast('Description is required', 'error');
                        return false;
                    }
                    if (!formData.category) {
                        showToast('Category is required', 'error');
                        return false;
                    }
                    return true;
                case 1: // Visuals
                    if (formData.images.length === 0) {
                        showToast('At least one image is required', 'error');
                        return false;
                    }
                    return true;
                case 2: // Details
                    if (!formData.price) {
                        showToast('Price is required', 'error');
                        return false;
                    }
                    if (!formData.stock) {
                        showToast('Stock is required', 'error');
                        return false;
                    }
                    return true;
                case 3: // Variants
                    // Optional, but if options exist, variants should be generated
                    if (formData.options.length > 0 && formData.variants.length === 0) {
                        showToast('Please generate variants or remove options', 'warning');
                        return false;
                    }
                    return true;
                case 4: // Advanced
                    // SEO fields are optional
                    return true;
                default:
                    return true;
            }
        };

        const handleNextStep = () => {
            if (validateStep(currentStep.value)) {
                currentStep.value++;
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
            handleSubmit,
            handleNextStep,
            newOptionName,
            newOptionValues,
            addOption,
            removeOption
        };
    }
});
