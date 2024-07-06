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
.v-container .v-card {
  padding-bottom: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}
</style>