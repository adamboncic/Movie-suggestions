<template>
  <v-container :class="['home-container', { 'has-search-results': movieStore.similarMovies.length }]">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="8" lg="6">
        <div class="header-search-wrapper">
          <div class="home-header" @click="clearSearch">
            <h1>
              <span>In The</span><span>Mood</span>
            </h1>
            <p class="home-prompt">
              (Discover films that resonate with your favorite movies)
            </p>
          </div>
          <SearchBar @search="onSearch" />
          <ErrorAlert 
            :error="movieStore.error"
            @clear="movieStore.error = null"
          />
        </div>
      </v-col>
    </v-row>
    <transition name="fade-up">
      <MovieGrid 
        v-if="movieStore.similarMovies.length"
        :movies="movieStore.similarMovies" 
        :header-text="headerText"
      />
    </transition>
  </v-container>
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
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

    const clearSearch = () => {
      movieStore.clearSearch();
    };

    const headerText = computed(() => {
      if (movieStore.selectedMovie) {
        return `Similar Movies to <em>"${movieStore.selectedMovie.title}"</em>`;
      }
      return 'Similar Movies';
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
  justify-content: center;
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}

.header-search-wrapper {
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: top center;
  text-align: center;
}

.has-search-results .header-search-wrapper {
  transform: translateY(-20px) scale(0.95);
}

.home-header h1 {
  display: flex;
  flex-direction: column;
  line-height: 1;
  cursor: pointer;
  font-family: 'Shapiro', sans-serif;
  align-items: center;
  font-size: 60px;
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}

.home-prompt {
  margin-bottom: 40px;
  font-size: 15px;
  transition: all 0.7s cubic-bezier(0.23, 1, 0.32, 1);
}

.has-search-results .home-header h1 {
  font-size: 40px;
}

.has-search-results .home-prompt {
  font-size: 13px;
  margin-bottom: 20px;
}

/* Mobile devices */
@media screen and (max-width: 600px) {
  .home-header h1 {
    font-size: 50px;
  }

  .home-prompt {
    font-size: 13px;
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