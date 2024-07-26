<template>
  <transition name="fade">
    <div v-if="isLoading" class="loading-overlay"></div>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const isLoading = ref(false);
    return { isLoading };
  },
}
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(83 83 83 / 70%);
  backdrop-filter: blur(5px);
  z-index: 9999;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>