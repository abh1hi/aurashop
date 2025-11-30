import { computed } from 'vue';

export const liquidSegmentedControlProps = {
    modelValue: [String, Number],
    options: {
        type: Array,
        default: () => [], // { label, value, icon }
    },
    size: {
        type: String,
        default: 'md', // sm, md, lg
    },
    fullWidth: Boolean,
};

export function useLiquidSegmentedControl(props, emit) {
    const containerClasses = computed(() => [
        'segmented-control',
        props.size,
        { 'full-width': props.fullWidth }
    ]);

    const selectOption = (value) => {
        emit('update:modelValue', value);
    };

    return {
        containerClasses,
        selectOption,
    };
}
