import { ref } from 'vue';

const visible = ref(false);
const product = ref(null);

export function useQuickView() {
    const openQuickView = (p) => {
        product.value = p;
        visible.value = true;
    };

    const closeQuickView = () => {
        visible.value = false;
        setTimeout(() => {
            product.value = null;
        }, 300); // Clear after animation
    };

    return {
        visible,
        product,
        openQuickView,
        closeQuickView
    };
}
