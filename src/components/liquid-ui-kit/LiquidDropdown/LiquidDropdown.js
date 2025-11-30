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

export function useLiquidDropdown(props, emit) {
    const isOpen = ref(false);
    const dropdownRef = ref(null);

    const selectedOption = computed(() => {
        return props.options.find(opt => opt.value === props.modelValue);
    });

    const toggleDropdown = () => {
        isOpen.value = !isOpen.value;
    };

    const selectOption = (value) => {
        emit('update:modelValue', value);
        isOpen.value = false;
    };

    const closeDropdown = (e) => {
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
