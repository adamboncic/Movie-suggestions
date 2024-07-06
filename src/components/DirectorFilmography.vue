<template>
  <v-container>
    <h2>Director's Filmography</h2>
    <v-row>
      <v-col v-for="movie in directorFilmography" :key="movie.id" cols="12" sm="6" md="4" lg="3">
        <router-link :to="{ name: 'MoviePage', params: { id: movie.id } }" custom v-slot="{ navigate }">
          <v-card @click="navigate">
            <v-img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" height="300" cover />
            <v-card-title>{{ movie.title }}</v-card-title>
            <v-card-subtitle>{{ movie.release_date }}</v-card-subtitle>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRouter } from 'vue-router';
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const movieStore = useMovieStore();
    const { directorFilmography } = storeToRefs(movieStore);

    const selectMovie = (movie) => {
      router.push({ name: 'MoviePage', params: { id: movie.id } });
    };

    return { directorFilmography, selectMovie };
  }
}
</script>