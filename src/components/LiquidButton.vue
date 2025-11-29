<template>
  <button :class="buttonClasses" @click="handleClick">
    <span v-if="icon && iconPosition === 'left'" class="material-icons-round">{{ icon }}</span>
    <span v-if="text">{{ text }}</span>
    <span v-if="icon && iconPosition === 'right'" class="material-icons-round">{{ icon }}</span>
    <span class="liquid-ripple"></span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  text: String,
  icon: String,
  iconPosition: {
    type: String,
    default: 'left',
  },
  type: {
    type: String,
    default: 'primary', // primary, glass
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
  },
});

const buttonClasses = computed(() => [
  'liquid-btn',
  `liquid-btn--${props.type}`,
  `liquid-btn--${props.size}`,
  {
    'liquid-btn--icon-only': !props.text && props.icon,
  },
]);

const handleClick = (event) => {
  const btn = event.currentTarget;
  const ripple = btn.querySelector('.liquid-ripple');
  if (ripple) {
    const rect = btn.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    const newRipple = ripple.cloneNode(true);
    btn.appendChild(newRipple);

    setTimeout(() => {
      newRipple.remove();
    }, 600);
  }
};

</script>

<style scoped>
.liquid-btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  border: none;
  border-radius: var(--radius-full);
  font-family: var(--font-family);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  -webkit-tap-highlight-color: transparent;
}

/* Sizes */
.liquid-btn--sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--text-sm);
}

.liquid-btn--md {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--text-base);
}

.liquid-btn--lg {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: var(--text-lg);
}

.liquid-btn--icon-only.liquid-btn--sm {
  padding: var(--spacing-xs);
}
.liquid-btn--icon-only.liquid-btn--md {
  padding: var(--spacing-sm);
}
.liquid-btn--icon-only.liquid-btn--lg {
  padding: var(--spacing-md);
}

/* Types */
.liquid-btn--primary {
  background-color: var(--primary-text);
  color: var(--bg-color);
}

.liquid-btn--primary:hover {
  background-color: #4a3a32;
}

.liquid-btn--glass {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-color);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
}

.liquid-btn--glass:hover {
  background: rgba(255, 255, 255, 0.4);
}

.liquid-ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
    width: 100px;
    height: 100px;
    margin-left: -50px;
    margin-top: -50px;
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
</style>
