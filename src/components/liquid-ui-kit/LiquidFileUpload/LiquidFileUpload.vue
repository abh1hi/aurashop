<template>
  <div class="liquid-file-upload">
    <div 
      class="file-upload-area" 
      :class="{ 'dragover': isDragOver }"
      @dragenter.prevent="isDragOver = true"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @drop.prevent="handleDrop"
    >
      <input 
        type="file" 
        class="file-input" 
        :multiple="multiple" 
        :accept="accept"
        @change="handleFileSelect"
      >
      <span class="material-icons-round upload-icon">cloud_upload</span>
      <h3 class="upload-text">{{ label }}</h3>
      <p class="upload-hint">{{ hint }}</p>
    </div>

    <div class="file-list" v-if="files.length > 0">
      <div v-for="(file, index) in files" :key="index" class="file-item">
        <span class="material-icons-round file-icon">insert_drive_file</span>
        <div class="file-info">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatSize(file.size) }}</span>
        </div>
        <button class="file-remove" @click="removeFile(index)" type="button">
          <span class="material-icons-round">close</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '*/*'
  },
  label: {
    type: String,
    default: 'Click or Drag files here'
  },
  hint: {
    type: String,
    default: 'Supports JPG, PNG, PDF up to 10MB'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const isDragOver = ref(false);
const files = ref([...props.modelValue]);

const handleFileSelect = (event) => {
  const newFiles = Array.from(event.target.files);
  addFiles(newFiles);
};

const handleDrop = (event) => {
  isDragOver.value = false;
  const newFiles = Array.from(event.dataTransfer.files);
  addFiles(newFiles);
};

const addFiles = (newFiles) => {
  if (props.multiple) {
    files.value = [...files.value, ...newFiles];
  } else {
    files.value = newFiles.slice(0, 1);
  }
  emit('update:modelValue', files.value);
  emit('change', files.value);
};

const removeFile = (index) => {
  files.value.splice(index, 1);
  emit('update:modelValue', files.value);
  emit('change', files.value);
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<style scoped src="./LiquidFileUpload.css"></style>
