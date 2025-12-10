import { computed } from 'vue';

export const liquidButtonProps = {
    text: String,
    icon: String,
    iconPosition: {
        type: String,
        default: 'left',
    },
    type: {
        type: String,
        default: 'primary', // primary, secondary, tertiary, outline, glass
    },
    size: {
        type: String,
        default: 'md', // sm, md, lg
    },
    loading: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
};

export function useLiquidButton(props: any) {
    const buttonClasses = computed(() => [
        'btn',
        `btn-${props.type}`,
        `btn-${props.size}`,
        {
            'btn-icon': props.icon && !props.text,
            'btn-loading': props.loading,
            'btn-disabled': props.disabled || props.loading
        },
    ]);

    const handleClick = (event: Event) => {
        // Ripple effect can be added here if needed
        console.log(event);
    };

    return {
        buttonClasses,
        handleClick,
    };
}
