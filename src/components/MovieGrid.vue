<template>
  <div class="movie-grid-container" v-if="visibleMovies.length > 0">
    <h2 class="movie-grid-header" v-html="headerText"></h2>
    <v-container fluid>
      <v-row>
        <v-col class="movie-grid-col" v-for="movie in visibleMovies" :key="movie.id" cols="12" sm="6" md="4" lg="3">
          <router-link :to="{ name: 'MoviePage', params: { id: movie.id } }" custom v-slot="{ navigate }">
            <v-card @click="navigate">
              <v-img
                :src="movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : noPosterPath"
                :aspect-ratio="2/3"
                cover
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
              <v-card-title>
                {{ movie.title }}
                <span class="release-date" v-if="movie.release_date">{{ formatDate(movie.release_date) }}</span>
              </v-card-title>
              <v-card-subtitle>
                <span class="rating" v-if="movie.vote_average">
                  <v-icon color="amber" size="small">mdi-star</v-icon>
                  {{ formatRating(movie.vote_average) }}
                </span>
                <div class="genre-pills">
                  <span v-for="genre in getGenres(movie.genre_ids)" :key="genre" class="genre-pill">
                    {{ genre }}
                  </span>
                </div>
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
import noPosterPath from '@/assets/no-poster.png';

export default {
  props: {
    movies: {
      type: Array,
      required: true
    },
    hasSearched: {
      type: Boolean,
      default: false
    },
    headerText: {
      type: String,
      default: ''
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
      return genreIds.map(id => movieStore.genreMap[id]).slice(0,2);
    };

    return { 
      visibleMovies, 
      hasMoreMovies, 
      loadMore, 
      formatDate, 
      formatRating, 
      getGenres,
      selectMovie,
      noPosterPath
    };
  }
};
</script>

<style scoped>
.v-card .v-card-subtitle {
  display: flex;
  gap: 5px;
  overflow: hidden;
}

.rating {
  display: flex;
  align-items: center;
  margin-right: 4px;
  flex-shrink: 0;
}

.rating .v-icon {
  margin-right: 2.5px;
}

.genre-pills {
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  overflow: hidden;
  flex-grow: 1;
}

.genre-pill {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2px 8px;
  white-space: nowrap;
  font-size: 11px;
  display: inline-block;
}

.genre-pills .genre-pill:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
@media (max-width: 600px) {
  .movie-grid-header {
    font-size: 1.25em;
  }
  .v-card .v-card-title {
    font-size: 1rem;
  }
  .movie-grid-col {
    padding: 12px 0;
  }
}
</style>