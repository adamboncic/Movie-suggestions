<template>
  <v-app>
    <!-- Loading animation -->
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <v-progress-linear
          indeterminate
          color="primary"
          height="3"
        ></v-progress-linear>
      </div>
    </transition>
    <!-- Main content -->
    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movieStore';

export default {
  setup() {
    const router = useRouter();
    const isLoading = ref(false);
    const movieStore = useMovieStore();
    let loadTimer = null;

    const startLoading = () => {
      clearTimeout(loadTimer);
      loadTimer = setTimeout(() => {
        isLoading.value = true;
      }, 200);
    };

    const stopLoading = () => {
      clearTimeout(loadTimer);
      isLoading.value = false;
    };

    onMounted(() => {
      router.beforeEach((to, from, next) => {
        startLoading();
        next();
      });

      router.afterEach(() => {
        stopLoading();
      });
    });

    onUnmounted(() => {
      clearTimeout(loadTimer);
    });

    return {
      isLoading,
      movieStore
    };
  },
}
</script>

<style>
/* General */
.v-container .v-card {
  padding-bottom: 10px;
}
.v-text-field .v-input__details {
  display: none;
}
/* Loading */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

/* Fade transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.fade-move-down-enter-active,
.fade-move-down-leave-active,
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  max-height: 1000px;
  opacity: 1;
  transform: translateY(0);
}

.fade-move-down-enter-from,
.fade-move-down-leave-to,
.fade-up-enter-from,
.fade-up-leave-to {
  max-height: 0;
  opacity: 0;
}

.fade-move-down-enter-from,
.fade-move-down-leave-to {
  transform: translateY(-30px);
}

.fade-up-enter-from,
.fade-up-leave-to {
  transform: translateY(30px);
}
</style>