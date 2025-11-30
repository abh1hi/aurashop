<template>
  <div class="otp-container">
    <template v-for="(digit, index) in length" :key="index">
      <input 
        ref="inputs"
        type="text" 
        class="otp-input" 
        maxlength="1" 
        pattern="[0-9]" 
        inputmode="numeric"
        :value="modelValue[index] || ''"
        @input="handleInput($event, index)"
        @keydown="handleKeydown($event, index)"
        @paste="handlePaste"
        @focus="handleFocus($event)"
      >
      <div v-if="separator && index === Math.floor(length / 2) - 1" class="otp-separator">-</div>
    </template>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  length: {
    type: Number,
    default: 6
  },
  separator: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'complete']);
const inputs = ref([]);

const updateValue = (newValue) => {
  emit('update:modelValue', newValue);
  if (newValue.length === props.length) {
    emit('complete', newValue);
  }
};

const handleInput = (e, index) => {
  const val = e.target.value;
  const currentVal = props.modelValue.split('');
  
  if (val.length === 1 && /^\d$/.test(val)) {
    currentVal[index] = val;
    updateValue(currentVal.join(''));
    
    // Move to next
    if (index < props.length - 1) {
      nextTick(() => inputs.value[index + 1].focus());
    }
  } else {
    // Invalid input or empty (handled by backspace usually, but just in case)
    // If user types non-digit, it won't update model, but input value might show it.
    // Force update to remove invalid char
    e.target.value = currentVal[index] || '';
  }
};

const handleKeydown = (e, index) => {
  const currentVal = props.modelValue.split('');

  if (e.key === 'Backspace') {
    if (!currentVal[index]) {
      // If empty, move back and delete
      if (index > 0) {
        currentVal[index - 1] = '';
        updateValue(currentVal.join(''));
        nextTick(() => inputs.value[index - 1].focus());
      }
    } else {
      // Delete current
      currentVal[index] = '';
      updateValue(currentVal.join(''));
    }
  } else if (e.key === 'ArrowLeft') {
    if (index > 0) inputs.value[index - 1].focus();
  } else if (e.key === 'ArrowRight') {
    if (index < props.length - 1) inputs.value[index + 1].focus();
  }
};

const handlePaste = (e) => {
  e.preventDefault();
  const pasteData = e.clipboardData.getData('text').slice(0, props.length);

  if (/^\d+$/.test(pasteData)) {
    updateValue(pasteData);
    // Focus last filled
    const lastIndex = Math.min(pasteData.length, props.length) - 1;
    if (lastIndex >= 0) nextTick(() => inputs.value[lastIndex].focus());
  }
};

const handleFocus = (e) => {
  e.target.select();
};
</script>

<style scoped>
.otp-container {
    display: flex;
    gap: 12px;
    justify-content: center;
}

.otp-input {
    width: 48px;
    height: 56px;
    border: 1px solid var(--glass-border, rgba(0,0,0,0.1));
    background: var(--glass-bg, rgba(255,255,255,0.8));
    border-radius: 12px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: var(--text-color, #333);
    transition: all 0.2s;
}

.otp-input:focus {
    outline: none;
    border-color: var(--primary-color, #667eea);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    transform: translateY(-2px);
}

.otp-input:not(:placeholder-shown) {
    background: rgba(102, 126, 234, 0.05);
    border-color: var(--primary-color, #667eea);
}

.otp-separator {
    display: flex;
    align-items: center;
    font-size: 24px;
    color: var(--text-tertiary, #999);
    font-weight: bold;
}
</style>
