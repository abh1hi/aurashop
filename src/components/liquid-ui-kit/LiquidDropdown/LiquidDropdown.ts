import { ref, computed, onMounted, onUnmounted } from 'vue';

export const liquidDropdownProps = {
    modelValue: [String, Number],
    options: {
        type: Array,
        default: () => [], // { label, value, icon }
    },
    placeholder: {
        type: String,
        default: 'Select an option',
    },
    label: String,
};

export function useLiquidDropdown(props: any, emit: any) {
    const isOpen = ref(false);
    const dropdownRef = ref<any>(null);

    const selectedOption = computed(() => {
        return props.options.find((opt: any) => opt.value === props.modelValue);
    });

    const toggleDropdown = () => {
        isOpen.value = !isOpen.value;
    };

    const selectOption = (value: any) => {
        emit('update:modelValue', value);
        isOpen.value = false;
    };

    const closeDropdown = (e: any) => {
        if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
            isOpen.value = false;
        }
    };

    onMounted(() => {
        document.addEventListener('click', closeDropdown);
    });

    onUnmounted(() => {
        document.removeEventListener('click', closeDropdown);
    });

    return {
        isOpen,
        dropdownRef,
        selectedOption,
        toggleDropdown,
        selectOption,
    };
}
