<template>
  <v-container class="movie-details">
    <div class="movie-details-nav">
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
          <div class="movie-details-wrapper">
            <h1 class="movie-title">{{ movie.title }} {{ formatDate(movie.release_date) }}</h1>
            <div class="movie-info">
              <div class="movie-meta">
                <div class="movie-rating">
                  <v-icon size="small" color="amber">mdi-star</v-icon>
                  <span>{{ formatRating(movie.vote_average) }}</span>
                </div>
                <div class="movie-runtime" v-if="movie.runtime">
                  {{ formatRuntime(movie.runtime) }}
                </div>
              </div>
              <div class="movie-genres">
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
              
            </div>
            <h3 class="section-title">Overview</h3>
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
          </div>
          <div class="button-group">
            <v-btn
              v-if="movie.imdb_id"
              :href="`https://www.imdb.com/title/${movie.imdb_id}`"
              target="_blank"
              color="warning"
              class="mt-4 mr-2"
            >
              View on IMDb
            </v-btn>
            <v-btn
              @click="openTrailer(movie.id)"
              color="primary"
              class="mt-4"
            >
              <v-icon left>mdi-play</v-icon>
              Play Trailer
            </v-btn>
          </div>
        </template>
        <p v-else-if="error" class="error-message">{{ error }}</p>
      </v-col>
    </v-row>
  </v-container>

  <TrailerPopup 
    :is-open="showTrailer"
    :trailer-key="trailerKey"
    @update:is-open="showTrailer = $event"
  />
</template>

<script>
import { useMovieStore } from '@/stores/movieStore';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate, formatRating } from '@/utils/formatters';
import TrailerPopup from '@/components/TrailerPopup.vue';
import tmdbApi from '@/services/tmdbApi';
import noPosterPath from '@/assets/no-poster.png';

export default {
  components: {
    TrailerPopup,
  },
  setup() {
    const movieStore = useMovieStore();
    const { trailer, director, selectedMovieDetails: movie, loading, error } = storeToRefs(movieStore);
    const router = useRouter();
    const showTrailer = ref(false);
    const trailerKey = ref('');

    const cast = computed(() => {
      return movie.value?.credits?.cast || [];
    });

    const formatRuntime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    };

    const updateTrailerPopupOpen = (value) => {
      trailerPopupOpen.value = value;
    };


    const openTrailer = async (movieId) => {
      try {
        const response = await tmdbApi.getMovieVideos(movieId);
        const trailer = response.data.results.find(video => video.type === 'Trailer');
        trailerKey.value = trailer ? trailer.key : '';
        showTrailer.value = true;
      } catch (error) {
        console.error('Error fetching trailer:', error);
      }
    };

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
      formatRuntime,
      showTrailer,
      trailerKey,
      openTrailer,
    };
  }
}
</script>

<style scoped>
p {
  font-weight: 300;
}
.v-btn .v-icon {
  margin-right: 8px;
}
.movie-details {
  padding-bottom: 50px;
  margin-bottom: 20px;
  border-bottom: 1px solid;
}
.movie-details-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3em;
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
.movie-info {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  gap: 10px;
}
.movie-meta {
  display: flex;
}
.movie-meta div + div::before {
  font-size: 1.1em;
  content: "•";
  padding: 8px;
}
.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.movie-overview {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}
.movie-crew, .movie-cast {
  margin-bottom: 1rem;
}
.button-group {
  margin-top: 2em;
}
.error-message {
  color: red;
  font-size: 1.2rem;
}
@media (max-width: 960px) {
  .poster-col {
    max-width: 300px;
    margin: 1em auto;
    padding: 0;
  }
}
@media (max-width: 600px) {
  .movie-details {
    font-size: 14px;
  }
  .movie-title{
    font-size: 2em;
  }
  .v-chip.v-chip--size-default {
    font-size: 14px;
  }
}
</style>