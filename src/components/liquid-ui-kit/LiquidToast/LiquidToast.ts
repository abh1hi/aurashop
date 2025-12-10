import { ref } from 'vue';

interface Toast {
    id: number;
    message: string;
    type: string;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
    const showToast = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
        const id = Date.now() + Math.random();
        toasts.value.push({ id, message, type });

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    };

    const removeToast = (id: number) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    };

    return { toasts, showToast, removeToast };
}
