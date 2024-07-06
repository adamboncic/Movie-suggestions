<template>
  <v-container v-if="director">
     <h2 class="mb-4"><em>{{ director.name }}'s</em> Filmography:</h2>
    <v-row>
      <v-col v-for="movie in directorFilmography" :key="movie.id" cols="12" sm="6" md="4" lg="3">
        <router-link :to="{ name: 'MoviePage', params: { id: movie.id } }" custom v-slot="{ navigate }">
          <v-card @click="navigate">
            <v-img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" height="300" cover />
            <v-card-title>{{ movie.title }}</v-card-title>
            <v-card-subtitle>{{ formatDate(movie.release_date) }}</v-card-subtitle>
          </v-card>
        </router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import { formatDate } from '@/utils/formatters';
import { onMounted } from 'vue';

export default {
  setup() {
    const movieStore = useMovieStore();
    const { director, directorFilmography } = storeToRefs(movieStore);
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      if (route.params.id) {
        await movieStore.fetchDirectorFilmography(route.params.id);
      }
    });

    const selectMovie = (movie) => {
      router.push({ name: 'MoviePage', params: { id: movie.id } });
    };

    return {
      director,
      directorFilmography,
      selectMovie,
      formatDate,
    };
  }
}
</script>