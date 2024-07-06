<template>
  <v-container class="home-container">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6">
        <transition name="fade-in" appear>
          <div class="text-center">
            <h1 class="text-h3 font-weight-light mb-6">In the Mood For...</h1>
            <p class="text-subtitle-1 mb-6">
              Enter a movie you love and let us find similar gems for you to enjoy.
            </p>
            <SearchBar @search="onSearch" />
            <ErrorAlert 
              :error="movieStore.error"
              @clear="movieStore.error = null"
            />
          </div>
        </transition>
      </v-col>
    </v-row>

    <transition name="fade-up">
      <MovieGrid 
        v-if="movieStore.hasSearched"
        :movies="movieStore.similarMovies" 
        :has-searched="movieStore.hasSearched"
      />
    </transition>
  </v-container>
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
import SearchBar from '@/components/SearchBar.vue';
import MovieGrid from '@/components/MovieGrid.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';

export default {
  components: {
    SearchBar,
    MovieGrid,
    ErrorAlert
  },
  setup() {
    const movieStore = useMovieStore();

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
      onSearch
    };
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.fade-in-enter-active, .fade-in-leave-active {
  transition: opacity 0.5s ease;
}

.fade-in-enter-from, .fade-in-leave-to {
  opacity: 0;
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.5s ease;
}

.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>