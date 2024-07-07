<template>
  <v-container v-if="director">
     <MovieGrid 
        :movies="directorFilmography"
        :header-text="headerText"
      />
  </v-container>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import { formatDate } from '@/utils/formatters';
import { onMounted, computed } from 'vue';
import MovieGrid from '@/components/MovieGrid.vue';

export default {
  components: {
    MovieGrid,
  },
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

    const headerText = computed(() => {
      return director.value?.name 
        ? `<em>${director.value.name}'s</em> filmography:` 
        : 'Director\'s filmography:';
    });

    return {
      director,
      directorFilmography,
      selectMovie,
      formatDate,
      headerText,
    };
  }
}
</script>