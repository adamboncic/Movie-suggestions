// src/stores/movieStore.js
import { defineStore } from 'pinia';
import tmdbApi from '@/services/tmdbApi';
import { useAuthStore } from './authStore';

export const useMovieStore = defineStore('movie', {
  state: () => ({
    selectedMovie: null,
    similarMovies: [],
    directorFilmography: [],
    searchResults: [],
    favoriteMovies: [],
    genres: [],
    loading: false,
    error: null,
    hasSearched: false,
  }),

  actions: {
    async searchMovies(query) {
      this.loading = true;
      this.error = null;
      this.hasSearched = true;
      try {
        if (!query || query.trim() === '') {
          this.searchResults = [];
          this.hasSearched = false;
          return;
        }
        const response = await tmdbApi.searchMovies(query);
        this.searchResults = response.data.results;
      } catch (error) {
        this.error = 'Error searching movies. Please try again.';
        console.error('Error searching movies:', error);
      } finally {
        this.loading = false;
      }
    },

    clearSearch() {
      this.searchResults = [];
      this.hasSearched = false;
      this.selectedMovie = null;
      this.similarMovies =[];
      this.directorFilmography = [];
    },

    async setSelectedMovie(movie) {
      this.selectedMovie = movie;
      await Promise.all([
        this.fetchSimilarMovies(movie.id),
        this.fetchDirectorFilmography(movie.id)
      ]);
    },

   async fetchSimilarMovies(movieId) {
      this.loading = true;
      this.error = null;
      this.similarMovies = [];

      try { 
        // Fetch first page
        const firstPageResponse = await tmdbApi.getSimilarMovies(movieId, 1);
        
        if (firstPageResponse.data.total_results > 0) {
          if (firstPageResponse.data.results.length > 0) {
            // Results found on the first page
            this.similarMovies = firstPageResponse.data.results.slice(0, 25);
          } else if (firstPageResponse.data.total_results > 1) {
            // No results on first page, but total pages > 1, so check second page
            const secondPageResponse = await tmdbApi.getSimilarMovies(movieId, 2);
            this.similarMovies = secondPageResponse.data.results.slice(0, 25);
          }
        }

        if (this.similarMovies.length === 0) {
          this.error = 'No similar movies found. Please try another.';
        }
      } catch (error) {
        this.error = 'Error fetching similar movies. Please try again.';
        console.error('Error fetching similar movies:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchGenres() {
      try {
        const response = await tmdbApi.getGenres();
        this.genres = response.data.genres;
      } catch (error) {
        console.error('Error fetching genres:', error);
        this.error = 'Failed to fetch genres';
      }
    },

   async fetchDirectorFilmography(movieId) {
    this.loading = true;
    this.error = null;
    try {
      // First, get the movie credits to find the director
      const movieCredits = await tmdbApi.getMovieCredits(movieId);
      const director = movieCredits.data.crew.find(person => person.job === 'Director');
      
      if (director) {
        // Then, get the person's movie credits
        const personCredits = await tmdbApi.getPersonMovieCredits(director.id);
        this.directorFilmography = personCredits.data.crew
          .filter(movie => movie.job === 'Director')
          .sort((a, b) => b.popularity - a.popularity);
      } else {
        this.directorFilmography = [];
        console.log('No director found for this movie');
      }
    } catch (error) {
      this.error = 'Error fetching director filmography. Please try again.';
      console.error('Error fetching director filmography:', error);
    } finally {
      this.loading = false;
    }
  },

    async fetchMovieDetails(movieId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await tmdbApi.getMovieDetails(movieId);
        this.selectedMovie = response.data;
      } catch (error) {
        this.error = 'Error fetching movie details. Please try again.';
        console.error('Error fetching movie details:', error);
      } finally {
        this.loading = false;
      }
    },

    toggleFavorite(movie) {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      const index = this.favoriteMovies.findIndex(m => m.id === movie.id);
      if (index > -1) {
        this.favoriteMovies.splice(index, 1);
      } else {
        this.favoriteMovies.push(movie);
      }
      // Here you would typically also update this on your backend
    },

    async fetchFavorites() {
      const authStore = useAuthStore();
      if (!authStore.user) return;

      this.loading = true;
      this.error = null;
      try {
        // This is a placeholder. In a real app, you'd fetch favorites from your backend
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.favoriteMovies = []; // Set to empty array for now
      } catch (error) {
        this.error = 'Error fetching favorites. Please try again.';
        console.error('Error fetching favorites:', error);
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    genreMap: (state) => {
      return state.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
    },
    isFavorite: (state) => (movieId) => {
      return state.favoriteMovies.some(movie => movie.id === movieId);
    }
  }
});