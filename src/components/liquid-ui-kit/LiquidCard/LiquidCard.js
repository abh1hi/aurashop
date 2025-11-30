import { computed } from 'vue';

export const liquidCardProps = {
    variant: {
        type: String,
        default: 'default', // default (glass), elevated, outlined
    },
    hoverable: {
        type: Boolean,
        default: false,
    },
};

export function useLiquidCard(props) {
    const cardClasses = computed(() => [
        'card',
        {
            'card-elevated': props.variant === 'elevated',
            'card-outlined': props.variant === 'outlined',
            'liquid-card': props.variant === 'liquid',
        },
    ]);

    return {
        cardClasses,
    };
}
