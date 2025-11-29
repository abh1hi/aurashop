import { ref } from 'vue';

const toasts = ref([]);

export function useToast() {
    const showToast = (message, type = 'info') => {
        const id = Date.now() + Math.random();
        toasts.value.push({ id, message, type });

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };

    const removeToast = (id) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    };

    return { toasts, showToast, removeToast };
}
