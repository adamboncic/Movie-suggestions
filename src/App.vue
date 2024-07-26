<template>
  <v-app>
    <!-- Loading animation -->
    <LoadingOverlay ref="loadingOverlay" />
    <!-- Main content -->
    <v-main>
      <v-container class="main-container" fluid>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="$route.fullPath" />
          </transition>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movieStore';
import LoadingOverlay from './components/LoadingOverlay.vue';

export default {
  components: {
    LoadingOverlay,
  },
  setup() {
    const loadingOverlay = ref(null);
    const router = useRouter();
    const movieStore = useMovieStore();

    const startLoading = () => {
      loadingOverlay.value.isLoading = true;
    };

    const stopLoading = () => {
      setTimeout(() => {
        loadingOverlay.value.isLoading = false;
      }, 300);
    };

    onMounted(() => {
      router.beforeEach((to, from, next) => {
        if (to.name === 'Home') {
          startLoading();
        }
        next();
      });

      router.afterEach((to) => {
        if (to.name === 'Home') {
          stopLoading();
        }
      });
    });

    return {
      loadingOverlay,
      movieStore
    };
  },
}
</script>

<style>
/* General */
body {
  font-family: "Space Grotesk", sans-serif;
}
.v-container {
  max-width: 1400px !important;
}
.v-container .v-card {
  padding-bottom: 10px;
}
.v-text-field .v-input__details {
  display: none;
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

.v-application--wrap {
  transition: none !important;
}

@media (max-width: 600px) {
  .main-container {
    padding: 0;
  }
}
</style>