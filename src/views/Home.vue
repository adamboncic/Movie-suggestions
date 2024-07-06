<template>
  <v-container>
    <h1 class="text-center mb-3">In the Mood For...</h1>
    <SearchBar />
    <MovieGrid 
      :movies="movieStore.similarMovies" 
      :has-searched="movieStore.hasSearched"
    />
  </v-container>
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
import SearchBar from '@/components/SearchBar.vue';
import MovieGrid from '@/components/MovieGrid.vue';

export default {
  components: {
    SearchBar,
    MovieGrid
  },
  setup() {
    const movieStore = useMovieStore();
    return { movieStore };
  }
};
</script>