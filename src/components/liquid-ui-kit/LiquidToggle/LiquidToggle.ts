import { computed } from 'vue';

export const liquidToggleProps = {
    modelValue: Boolean,
    label: String,
    disabled: Boolean,
    icon: String, // Icon inside the thumb
};

export function useLiquidToggle(props: any, emit: any) {
    const toggleClasses = computed(() => [
        'selection-control',
        {
            'disabled': props.disabled,
        },
    ]);

    const handleChange = (event: any) => {
        if (!props.disabled) {
            emit('update:modelValue', event.target.checked);
        }
    };

    return {
        toggleClasses,
        handleChange,
    };
}
