<template>
  <div class="movie-grid-container" v-if="visibleMovies.length > 0">
    <h2>Similar Movies</h2>
    <v-container fluid>
      <v-row>
        <v-col v-for="movie in visibleMovies" :key="movie.id" cols="12" sm="6" md="4" lg="3">
          <router-link :to="{ name: 'MoviePage', params: { id: movie.id } }" custom v-slot="{ navigate }">
            <v-card @click="navigate">
              <v-img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/path/to/placeholder-image.jpg'"
                :aspect-ratio="2/3"
                cover
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-card-title>{{ movie.title }}</v-card-title>
              <v-card-subtitle>
                {{ formatDate(movie.release_date) }} | 
                <v-icon small color="amber">mdi-star</v-icon>
                {{ formatRating(movie.vote_average) }} | 
                {{ getGenres(movie.genre_ids) }}
              </v-card-subtitle>
            </v-card>
          </router-link>
        </v-col>
      </v-row>
      <v-row v-if="hasMoreMovies">
        <v-col class="text-center">
          <v-btn @click="loadMore">Load More</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';
import { useMovieStore } from '@/stores/movieStore';
import { formatDate, formatRating } from '@/utils/formatters';

export default {
  props: {
    movies: {
      type: Array,
      required: true
    },
    hasSearched: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const router = useRouter();
    const movieStore = useMovieStore();
    const itemsPerPage = 8;
    const currentPage = ref(1);

    const selectMovie = (movie) => {
      router.push({ name: 'MoviePage', params: { id: movie.id } });
    };

    const visibleMovies = computed(() => {
      return props.movies.slice(0, currentPage.value * itemsPerPage);
    });

    const hasMoreMovies = computed(() => {
      return visibleMovies.value.length < props.movies.length;
    });

    const loadMore = () => {
      currentPage.value++;
    };

    const getGenres = (genreIds) => {
      return genreIds.map(id => movieStore.genreMap[id] || 'Unknown').join(', ');
    };

    return { 
      visibleMovies, 
      hasMoreMovies, 
      loadMore, 
      formatDate, 
      formatRating, 
      getGenres,
      selectMovie,
    };
  }
};
</script>