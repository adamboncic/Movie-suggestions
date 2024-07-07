<template>
  <v-container class="movie-details">
    <div class="d-flex justify-space-between align-center mb-6">
      <v-btn 
        @click="goBack" 
        class="back-button" 
        prepend-icon="mdi-arrow-left"
      >
        Back
      </v-btn>
      <v-btn 
        @click="goHome" 
        class="home-button" 
        color="amber"
        prepend-icon="mdi-home"
      >
        Home
      </v-btn>
    </div>
    
    <v-row>
      <v-col cols="12" md="4" class="poster-col">
        <div class="poster-wrapper">
          <v-img 
            :src="posterSrc"
            :alt="movie?.title || 'Movie poster'"
            class="movie-poster"
            cover
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </div>
      </v-col>
      <v-col cols="12" md="8" class="info-col">
        <v-skeleton-loader
          v-if="loading"
          type="article"
        ></v-skeleton-loader>
        <template v-else-if="movie">
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
        </template>
        <p v-else-if="error" class="error-message">{{ error }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate, formatRating } from '@/utils/formatters';
import noPosterPath from '@/assets/no-poster.png';

export default {
  setup() {
    const movieStore = useMovieStore();
    const { selectedMovieDetails: movie, loading, error } = storeToRefs(movieStore);
    const router = useRouter();

    const director = computed(() => {
      return movie.value?.credits?.crew.find(person => person.job === 'Director');
    });

    const cast = computed(() => {
      return movie.value?.credits?.cast || [];
    });

    const posterSrc = computed(() => {
      if (loading.value || !movie.value?.poster_path) {
        return noPosterPath;
      }
      return `https://image.tmdb.org/t/p/w500${movie.value.poster_path}`;
    });

    const goBack = () => {
      router.go(-1);
    };

    const goHome = () => {
      router.push('/');
    };

    return {
      movie,
      loading,
      error,
      director,
      cast,
      posterSrc,
      formatDate,
      formatRating,
      goBack,
      goHome,
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
  margin-bottom: 0;
  background-color: #5b5b5bb8;
}
.home-button {
  margin-bottom: 0;
}
.poster-wrapper {
  width: 100%;
  padding-top: 150%; /* 2:3 aspect ratio */
  position: relative;
}
.movie-poster {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
.error-message {
  color: red;
  font-size: 1.2rem;
}
@media (max-width: 960px) {
  .poster-col {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>