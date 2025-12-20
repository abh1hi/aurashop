<template>
  <div class="pdf-viewer-container">
    <iframe :src="src" class="pdf-iframe" type="application/pdf" width="100%" height="100%">
        <p>Your browser does not support PDFs. <a :href="src">Download the PDF</a>.</p>
    </iframe>
  </div>
</template>

<script setup lang="ts">
defineProps({
  src: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.pdf-viewer-container {
    width: 100%;
    height: 500px;
    border-radius: var(--radius-xl);
    border: 1px solid var(--liquid-glass-border);
    overflow: hidden;
    background: var(--liquid-glass-base);
}

.pdf-iframe {
    border: none;
    width: 100%;
    height: 100%;
}
</style>
