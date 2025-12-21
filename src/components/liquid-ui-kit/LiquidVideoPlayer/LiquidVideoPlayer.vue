<template>
  <div class="video-player-container-vue">
    <video 
      ref="videoRef"
      class="video-element"
      :poster="poster"
      @timeupdate="updateProgress"
      @loadedmetadata="onLoadedMetadata"
      @ended="onEnded"
    >
      <source :src="src" type="video/mp4">
      Your browser does not support the video tag.
    </video>

    <div class="video-controls">
      <div class="video-progress-container" @click="seek">
        <div class="video-progress-bar" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="video-buttons">
        <div class="video-btn-group">
          <button class="video-btn" @click="togglePlay">
            <span class="material-icons-round">{{ isPlaying ? 'pause' : 'play_arrow' }}</span>
          </button>
          <button class="video-btn" @click="toggleMute">
            <span class="material-icons-round">{{ isMuted ? 'volume_off' : 'volume_up' }}</span>
          </button>
          <!-- Volume slider could be added here -->
          <span class="video-time">{{ formattedCurrentTime }} / {{ formattedDuration }}</span>
        </div>

        <div class="video-btn-group">
          <button class="video-btn" @click="toggleFullscreen">
            <span class="material-icons-round">fullscreen</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ''
  }
});

const videoRef = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const currentTime = ref(0);
const duration = ref(0);

const progress = computed(() => {
  if (!duration.value) return 0;
  return (currentTime.value / duration.value) * 100;
});

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const formattedCurrentTime = computed(() => formatTime(currentTime.value));
const formattedDuration = computed(() => formatTime(duration.value));

const togglePlay = () => {
  if (!videoRef.value) return;
  if (videoRef.value.paused) {
    videoRef.value.play();
    isPlaying.value = true;
  } else {
    videoRef.value.pause();
    isPlaying.value = false;
  }
};

const toggleMute = () => {
  if (!videoRef.value) return;
  videoRef.value.muted = !videoRef.value.muted;
  isMuted.value = videoRef.value.muted;
};

const updateProgress = () => {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;
};

const onLoadedMetadata = () => {
  if (!videoRef.value) return;
  duration.value = videoRef.value.duration;
};

const onEnded = () => {
  isPlaying.value = false;
};

const seek = (e: MouseEvent) => {
  if (!videoRef.value) return;
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percentage = x / rect.width;
  videoRef.value.currentTime = percentage * duration.value;
};

const toggleFullscreen = () => {
  if (!videoRef.value) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoRef.value.parentElement?.requestFullscreen();
  }
};
</script>

<style scoped>
.video-player-container-vue {
    position: relative;
    width: 100%;
    max-width: 800px;
    border-radius: var(--radius-xl);
    overflow: hidden;
    background: #000;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
    aspect-ratio: 16/9;
}

.video-element {
    width: 100%;
    height: 100%;
    object-fit: contain; /* Changed to contain to avoid cropping */
    display: block;
}

.video-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.video-player-container-vue:hover .video-controls {
    opacity: 1;
}

.video-progress-container {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin-bottom: 12px;
    cursor: pointer;
    position: relative;
}

.video-progress-bar {
    height: 100%;
    background: var(--primary-color);
    border-radius: 2px;
    position: relative;
}

.video-progress-bar::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 12px;
    height: 12px;
    background: white;
    border-radius: 50%;
    transition: transform 0.2s;
}

.video-progress-container:hover .video-progress-bar::after {
    transform: translateY(-50%) scale(1);
}

.video-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.video-btn-group {
    display: flex;
    align-items: center;
    gap: 16px;
}

.video-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    opacity: 0.8;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.video-btn:hover {
    opacity: 1;
}

.video-time {
    color: white;
    font-size: 0.8rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
}
</style>
