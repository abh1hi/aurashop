<template>
  <div class="autocomplete-wrapper" ref="wrapper">
    <div class="input-group">
      <span class="material-icons-round search-icon">search</span>
      <input 
        type="text" 
        class="autocomplete-input" 
        :placeholder="placeholder" 
        v-model="query"
        @input="handleInput"
        @focus="handleFocus"
      >
      <div class="input-actions">
        <div :class="['input-spinner', { active: loading }]"></div>
        <button :class="['clear-btn', { visible: query.length > 0 && !loading }]" @click="clearInput" title="Clear">
          <span class="material-icons-round">close</span>
        </button>
      </div>
    </div>
    
    <div :class="['suggestions-list', { active: showSuggestions }]">
      <div v-if="results.length === 0 && query.length > 2 && !loading" class="no-results">
        No results found
      </div>
      <div 
        v-else 
        v-for="(item, index) in results" 
        :key="index" 
        class="suggestion-item" 
        @click="selectItem(item)"
      >
        <span class="material-icons-round suggestion-icon">location_on</span>
        <!-- Photon puts name in properties.name, city, country etc. -->
        <span v-html="highlightMatch(formatDisplayName(item))"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import './LiquidAutocomplete.css';

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search location...'
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

const query = ref('');
const results = ref([]);
const loading = ref(false);
const showSuggestions = ref(false);
const wrapper = ref(null);
let debounceTimeout = null;

watch(() => props.modelValue, (newValue) => {
    if (newValue !== query.value) {
        query.value = newValue;
    }
});

const handleInput = () => {
  emit('update:modelValue', query.value);
  
  if (query.value.length < 3) {
    results.value = [];
    showSuggestions.value = false;
    return;
  }

  loading.value = true;
  clearTimeout(debounceTimeout);
  
  debounceTimeout = setTimeout(async () => {
    try {
      // Using Photon API (Komoot) for search
      // https://photon.komoot.io/api/?q=berlin
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query.value)}&limit=5`);
      const data = await response.json();
      
      // Photon returns GeoJSON features
      results.value = data.features || [];
      showSuggestions.value = true;
    } catch (error) {
      console.error('Search failed:', error);
      results.value = [];
    } finally {
      loading.value = false;
    }
  }, 500);
};

const handleFocus = () => {
    if (results.value.length > 0) {
        showSuggestions.value = true;
    }
};

const clearInput = () => {
  query.value = '';
  emit('update:modelValue', '');
  results.value = [];
  showSuggestions.value = false;
};

const selectItem = (item) => {
  const displayName = formatDisplayName(item);
  query.value = displayName;
  emit('update:modelValue', displayName);
  emit('select', item);
  showSuggestions.value = false;
};

const formatDisplayName = (item) => {
    if (item.display_name) return item.display_name; // Fallback
    if (item.properties) {
        const { name, city, country, state } = item.properties;
        return [name, city, state, country].filter(Boolean).join(', ');
    }
    return 'Unknown Location';
};

const highlightMatch = (text) => {
  if (!query.value) return text;
  const regex = new RegExp(`(${query.value})`, 'gi');
  return text.replace(regex, '<span class="highlight">$1</span>');
};

const handleClickOutside = (event) => {
  if (wrapper.value && !wrapper.value.contains(event.target)) {
    showSuggestions.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
