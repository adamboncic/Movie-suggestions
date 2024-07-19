<template>
  <v-container :class="['home-container', { 'has-search-results': movieStore.similarMovies.length }]">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6">
        <transition name="fade-in" appear>
          <div class="header-search-wrapper" :class="{ 'minimized': movieStore.similarMovies.length }">
            <div class="home-header" @click="clearSearch">
              <h1>
                <span>In The</span><span>Mood</span>
              </h1>
              <p class="home-prompt">
                (Discover films that resonate with your favorites)
              </p>
            </div>
            <SearchBar @search="onSearch"/>
            <ErrorAlert 
              :error="movieStore.error"
              @clear="movieStore.error = null"
            />
          </div>
        </transition>
      </v-col>
    </v-row>

      <div v-if="similarMovies.length" class="movie-grid-wrapper" key="movie-grid">
        <MovieGrid 
          :movies="similarMovies" 
          :header-text="headerText"
        />
      </div>

  </v-container>
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import SearchBar from '@/components/SearchBar.vue';
import MovieGrid from '@/components/MovieGrid.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import { ref, computed } from 'vue';

export default {
  components: {
    SearchBar,
    MovieGrid,
    ErrorAlert
  },
  setup() {
    const movieStore = useMovieStore();
    const { similarMovies } = storeToRefs(movieStore);

    const clearSearch = () => {
      movieStore.clearSearch();
    };

    const headerText = computed(() => {
      if (movieStore.selectedMovie) {
        return `Similar movies to <em>${movieStore.selectedMovie.title}</em>`;
      }
      return 'Similar movies:';
    });

    const onSearch = () => {
      // Scroll to results if needed
      setTimeout(() => {
        const movieGrid = document.querySelector('.movie-grid');
        if (movieGrid) {
          movieGrid.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };

    return { 
      movieStore,
      similarMovies,
      onSearch,
      clearSearch,
      headerText
    };
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 2rem;
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.header-search-wrapper {
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
  transform-origin: top center;
  text-align: center;
  will-change: transform, opacity;
}

.header-search-wrapper.minimized {
  transform: translateY(-2rem) scale(0.95);
}

.home-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.home-header h1 {
  display: flex;
  flex-direction: column;
  line-height: 1;
  cursor: pointer;
  font-family: 'Shapiro', 'shapiro95', sans-serif;
  font-weight: 100;
  align-items: center;
  font-size: 60px;
}

.home-prompt {
  margin-top: 5px;
  margin-bottom: 40px;
  font-size: 15px;
  opacity: 1;
  transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.has-search-results .home-header h1 {
  font-size: 40px;
}

.has-search-results .home-prompt {
  font-size: 13px;
  margin-bottom: 20px;
}

/* Fade-in animation for header elements */
.fade-in-enter-active,
.fade-in-leave-active {
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000);
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-in-enter-to,
.fade-in-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Mobile devices */
@media screen and (max-width: 600px) {
  .home-header h1 {
    font-size: 60px;
  }
  .home-prompt {
    font-size: 13px;
  }
  .has-search-results .home-header h1 {
    font-size: 30px;
  }
}

/* Medium screens */
@media screen and (min-width: 601px) and (max-width: 1024px) {
  .home-header h1 {
    font-size: 70px;
  }
  .home-prompt {
    font-size: 16px;
  }
}

/* Very large screens */
@media screen and (min-width: 1025px) {
  .home-header h1 {
    font-size: 80px;
  }
  .home-prompt {
    font-size: 18px;
  }
}
</style>
