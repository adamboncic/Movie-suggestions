<template>
  <v-container v-if="movie" class="movie-details">
    <v-btn 
      @click="goBack" 
      class="back-button" 
      prepend-icon="mdi-arrow-left"
    >
      Back
    </v-btn>
    
    <v-row>
      <v-col cols="12" md="4" class="poster-col">
        <v-img :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`" class="movie-poster" />
      </v-col>
      <v-col cols="12" md="8" class="info-col">
        <h1 class="movie-title">{{ movie.title }}</h1>
        <div class="movie-meta">
          <span>{{ formatDate(movie.release_date) }}</span>
          <v-chip
            v-for="genre in movie.genres"
            :key="genre.id"
            class="ma-1"
            color="primary"
            text-color="white"
          >
            {{ genre.name }}
          </v-chip>
        </div>
        <div class="movie-rating">
          <v-icon color="amber">mdi-star</v-icon>
          <span>{{ formatRating(movie.vote_average) }}</span>
        </div>
        <p class="movie-overview">{{ movie.overview }}</p>
        <div class="movie-crew" v-if="director">
          <h3>Director</h3>
          <p>{{ director.name }}</p>
        </div>
        <div class="movie-cast" v-if="cast.length">
          <h3>Top Cast</h3>
          <ul>
            <li v-for="actor in cast.slice(0, 5)" :key="actor.id">{{ actor.name }}</li>
          </ul>
        </div>
        <v-btn
          v-if="movie.imdb_id"
          :href="`https://www.imdb.com/title/${movie.imdb_id}`"
          target="_blank"
          color="warning"
          class="mt-4"
        >
          View on IMDb
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate, formatRating } from '@/utils/formatters';

export default {
  setup() {
    const movieStore = useMovieStore();
    const { selectedMovie: movie } = storeToRefs(movieStore);
    const router = useRouter();

    const director = computed(() => {
      return movie.value?.credits?.crew.find(person => person.job === 'Director');
    });

    const cast = computed(() => {
      return movie.value?.credits?.cast || [];
    });

    const goBack = () => {
      movieStore.clearSearch();
      router.go(-1);
    };

    return {
      movie,
      director,
      cast,
      formatDate,
      formatRating,
      goBack
    };
  }
}
</script>

<style scoped>
.movie-details {
  max-width: 1200px;
  padding-bottom: 50px;
  margin-bottom: 20px;
  border-bottom: 1px solid;
}

.back-button {
  margin-bottom: 30px;
  background-color: #5b5b5bb8;
}

.movie-poster {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.movie-title {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.movie-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.movie-overview {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.movie-crew, .movie-cast {
  margin-bottom: 1rem;
}

@media (max-width: 960px) {
  .poster-col {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>