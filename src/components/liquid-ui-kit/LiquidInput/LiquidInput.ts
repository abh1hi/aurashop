import { computed } from 'vue';

export const liquidInputProps = {
    modelValue: String,
    placeholder: String,
    icon: String,
    iconPosition: {
        type: String,
        default: 'left',
    },
    type: {
        type: String,
        default: 'text',
    },
    search: Boolean,
};

export function useLiquidInput(props: any) {
    const inputClasses = computed(() => [
        'input-field',
        {
            'input-search': props.search,
            'has-start-icon': props.icon && props.iconPosition === 'left',
            'has-end-icon': props.icon && props.iconPosition === 'right',
        },
    ]);

    return {
        inputClasses,
    };
}
