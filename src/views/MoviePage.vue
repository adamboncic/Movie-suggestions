<template>
  <v-container class="movie-page">
    <MovieDetails />
    <DirectorFilmography />
  </v-container>
</template>

<script>
import MovieDetails from '@/components/MovieDetails.vue';
import DirectorFilmography from '@/components/DirectorFilmography.vue';
import { useMovieStore } from '@/stores/movieStore';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    MovieDetails,
    DirectorFilmography
  },
  setup() {
    const movieStore = useMovieStore();
    const route = useRoute();

    const fetchMovieData = async (id) => {
      await movieStore.fetchMovieDetails(id);
      await Promise.all([
        movieStore.fetchDirectorFilmography(id)
      ]);
    };

    onMounted(() => {
      fetchMovieData(route.params.id);
    });

    watch(() => route.params.id, (newId) => {
      fetchMovieData(newId);
    });

    return { movieStore };
  }
}
</script>

<style scoped>
  .movie-page.v-container {
    padding: 0;
  }
</style>
